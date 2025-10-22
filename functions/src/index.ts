/**
 * Cloud Functions for WHS Bowling Site
 *
 * This file contains Firebase Cloud Functions for:
 * - Public stats aggregation
 * - Stats synchronization from Stats app
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Interface for player stats
 */
interface PlayerStats {
  uid: string;
  name: string;
  displayName?: string;
  average: number;
  highGame: number;
  highSeries: number;
  gamesPlayed: number;
  programId: string;
}

/**
 * Interface for public player stats (what gets exposed)
 */
interface PublicPlayerStats {
  name: string;
  average: number;
  highGame: number;
  highSeries: number;
  accolades?: string[];
  achievements?: string[];
}

/**
 * Interface for public stats document
 */
interface PublicStats {
  programId: string;
  teamAverage: number;
  totalGames: number;
  topPlayers: PublicPlayerStats[];
  recentHighGames: Array<{
    playerName: string;
    score: number;
    date: string;
  }>;
  updatedAt: admin.firestore.Timestamp;
}

/**
 * Scheduled function to update public stats
 * Runs daily at 2 AM
 *
 * This function aggregates player statistics and creates a public-facing
 * stats document that can be read without authentication.
 */
export const updatePublicStats = functions.pubsub
  .schedule('0 2 * * *') // Run at 2 AM daily
  .timeZone('America/Chicago') // Central Time
  .onRun(async (context) => {
    try {
      const programId = 'willard-tigers';

      console.log(`Starting public stats update for program: ${programId}`);

      // Fetch all active players in the program
      const playersSnapshot = await db.collection('players')
        .where('programId', '==', programId)
        .where('isActive', '==', true)
        .get();

      if (playersSnapshot.empty) {
        console.log('No active players found');
        return null;
      }

      const players: PlayerStats[] = [];
      let totalAverage = 0;
      let totalGames = 0;

      // Process each player
      for (const doc of playersSnapshot.docs) {
        const data = doc.data();
        const playerStats: PlayerStats = {
          uid: doc.id,
          name: data.name || data.displayName || 'Unknown',
          displayName: data.displayName,
          average: data.averageScore || data.average || 0,
          highGame: data.highGame || 0,
          highSeries: data.highSeries || 0,
          gamesPlayed: data.gamesPlayed || 0,
          programId: data.programId
        };

        players.push(playerStats);
        totalAverage += playerStats.average * playerStats.gamesPlayed;
        totalGames += playerStats.gamesPlayed;
      }

      // Calculate team average
      const teamAverage = totalGames > 0 ? Math.round(totalAverage / totalGames) : 0;

      // Get top 10 players by average (minimum 3 games)
      const topPlayers = players
        .filter(p => p.gamesPlayed >= 3)
        .sort((a, b) => b.average - a.average)
        .slice(0, 10)
        .map(p => {
          const publicStats: PublicPlayerStats = {
            name: p.name,
            average: Math.round(p.average),
            highGame: p.highGame,
            highSeries: p.highSeries
          };
          return publicStats;
        });

      // Get recent high games (last 30 days, top 10)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentGamesSnapshot = await db.collection('games')
        .where('programId', '==', programId)
        .where('date', '>=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .orderBy('date', 'desc')
        .orderBy('score', 'desc')
        .limit(100)
        .get();

      // Process recent high games
      const recentHighGames: Array<{ playerName: string; score: number; date: string }> = [];
      const seenPlayers = new Set<string>();

      for (const gameDoc of recentGamesSnapshot.docs) {
        const gameData = gameDoc.data();
        const playerId = gameData.playerId;

        // Only include each player's best game once
        if (!seenPlayers.has(playerId) && recentHighGames.length < 10) {
          // Find player name
          const player = players.find(p => p.uid === playerId);
          if (player && gameData.score) {
            recentHighGames.push({
              playerName: player.name,
              score: gameData.score,
              date: gameData.date?.toDate?.()?.toISOString() || new Date().toISOString()
            });
            seenPlayers.add(playerId);
          }
        }

        if (recentHighGames.length >= 10) break;
      }

      // Sort recent high games by score
      recentHighGames.sort((a, b) => b.score - a.score);

      // Create public stats document
      const publicStats: PublicStats = {
        programId,
        teamAverage,
        totalGames,
        topPlayers,
        recentHighGames,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp
      };

      // Write to publicStats collection
      await db.collection('publicStats')
        .doc(programId)
        .set(publicStats);

      console.log(`Successfully updated public stats for ${programId}`);
      console.log(`Team Average: ${teamAverage}, Total Games: ${totalGames}`);
      console.log(`Top Players: ${topPlayers.length}, Recent High Games: ${recentHighGames.length}`);

      return { success: true, programId, teamAverage, playerCount: players.length };

    } catch (error) {
      console.error('Error updating public stats:', error);
      throw error;
    }
  });

/**
 * HTTP function to manually trigger public stats update
 * Useful for testing and on-demand updates
 *
 * Usage: POST https://us-central1-[PROJECT-ID].cloudfunctions.net/triggerPublicStatsUpdate
 *
 * Optional query parameter: programId (defaults to 'willard-tigers')
 */
export const triggerPublicStatsUpdate = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const programId = (req.query.programId as string) || 'willard-tigers';

    console.log(`Manual trigger: Updating public stats for ${programId}`);

    // Use the same logic as the scheduled function
    // Fetch all active players
    const playersSnapshot = await db.collection('players')
      .where('programId', '==', programId)
      .where('isActive', '==', true)
      .get();

    if (playersSnapshot.empty) {
      res.json({ success: false, message: 'No active players found' });
      return;
    }

    const players: PlayerStats[] = [];
    let totalAverage = 0;
    let totalGames = 0;

    for (const doc of playersSnapshot.docs) {
      const data = doc.data();
      const playerStats: PlayerStats = {
        uid: doc.id,
        name: data.name || data.displayName || 'Unknown',
        displayName: data.displayName,
        average: data.averageScore || data.average || 0,
        highGame: data.highGame || 0,
        highSeries: data.highSeries || 0,
        gamesPlayed: data.gamesPlayed || 0,
        programId: data.programId
      };

      players.push(playerStats);
      totalAverage += playerStats.average * playerStats.gamesPlayed;
      totalGames += playerStats.gamesPlayed;
    }

    const teamAverage = totalGames > 0 ? Math.round(totalAverage / totalGames) : 0;

    const topPlayers = players
      .filter(p => p.gamesPlayed >= 3)
      .sort((a, b) => b.average - a.average)
      .slice(0, 10)
      .map(p => ({
        name: p.name,
        average: Math.round(p.average),
        highGame: p.highGame,
        highSeries: p.highSeries
      }));

    // Get recent high games
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentGamesSnapshot = await db.collection('games')
      .where('programId', '==', programId)
      .where('date', '>=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .orderBy('date', 'desc')
      .orderBy('score', 'desc')
      .limit(100)
      .get();

    const recentHighGames: Array<{ playerName: string; score: number; date: string }> = [];
    const seenPlayers = new Set<string>();

    for (const gameDoc of recentGamesSnapshot.docs) {
      const gameData = gameDoc.data();
      const playerId = gameData.playerId;

      if (!seenPlayers.has(playerId) && recentHighGames.length < 10) {
        const player = players.find(p => p.uid === playerId);
        if (player && gameData.score) {
          recentHighGames.push({
            playerName: player.name,
            score: gameData.score,
            date: gameData.date?.toDate?.()?.toISOString() || new Date().toISOString()
          });
          seenPlayers.add(playerId);
        }
      }

      if (recentHighGames.length >= 10) break;
    }

    recentHighGames.sort((a, b) => b.score - a.score);

    const publicStats: PublicStats = {
      programId,
      teamAverage,
      totalGames,
      topPlayers,
      recentHighGames,
      updatedAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp
    };

    await db.collection('publicStats')
      .doc(programId)
      .set(publicStats);

    res.json({
      success: true,
      message: 'Public stats updated successfully',
      data: {
        programId,
        teamAverage,
        totalGames,
        playerCount: players.length,
        topPlayersCount: topPlayers.length,
        recentHighGamesCount: recentHighGames.length
      }
    });

  } catch (error) {
    console.error('Error in manual stats update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update public stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * HTTP function to get public stats (read-only)
 * No authentication required
 *
 * Usage: GET https://us-central1-[PROJECT-ID].cloudfunctions.net/getPublicStats?programId=willard-tigers
 */
export const getPublicStats = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for public access
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const programId = (req.query.programId as string) || 'willard-tigers';

    const statsDoc = await db.collection('publicStats')
      .doc(programId)
      .get();

    if (!statsDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Public stats not found for this program'
      });
      return;
    }

    const stats = statsDoc.data();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
