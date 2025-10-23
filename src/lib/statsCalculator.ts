/**
 * Stats Calculator - Calculate bowling statistics from game data
 *
 * This module fetches game data from the Stats Firebase project and calculates
 * useful statistics for players and teams.
 */

import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from './statsFirebase';

export interface PlayerGameStats {
  playerId: string;
  playerName: string;
  games: number;
  totalPins: number;
  average: number;
  highGame: number;
  lowGame: number;
  strikes: number;
  spares: number;
  splits: number;
  recentGames: number[]; // Last 5 games
}

export interface TeamStats {
  totalPlayers: number;
  teamAverage: number;
  totalGames: number;
  highTeamGame: number;
  highIndividualGame: number;
  highIndividualGamePlayer: string;
  topAverages: Array<{ playerName: string; average: number }>;
}

/**
 * Calculate player statistics from their game data
 */
export async function calculatePlayerStats(playerId: string): Promise<PlayerGameStats | null> {
  try {
    console.log(`📊 Calculating stats for player: ${playerId}`);

    // Fetch player info
    const playerRef = doc(statsDb, 'players', playerId);
    const playerSnap = await getDoc(playerRef);

    if (!playerSnap.exists()) {
      console.warn(`⚠️  Player ${playerId} not found`);
      return null;
    }

    const playerData = playerSnap.data();
    const playerName = `${playerData.firstName || ''} ${playerData.lastName || ''}`.trim();

    // Fetch all games for this player
    const gamesRef = collection(statsDb, 'games');
    const gamesQuery = query(
      gamesRef,
      where('players', 'array-contains', playerId)
    );

    const gamesSnapshot = await getDocs(gamesQuery);

    if (gamesSnapshot.empty) {
      console.log(`📭 No games found for ${playerName}`);
      return {
        playerId,
        playerName,
        games: 0,
        totalPins: 0,
        average: 0,
        highGame: 0,
        lowGame: 0,
        strikes: 0,
        spares: 0,
        splits: 0,
        recentGames: [],
      };
    }

    // Extract all scores for this player from all games
    const allScores: number[] = [];
    let totalStrikes = 0;
    let totalSpares = 0;
    let totalSplits = 0;

    gamesSnapshot.forEach((gameDoc) => {
      const gameData = gameDoc.data();

      // Find this player's score in the game
      const playerIndex = gameData.players.indexOf(playerId);
      if (playerIndex !== -1 && gameData.scores && gameData.scores[playerIndex] != null) {
        const score = gameData.scores[playerIndex];
        if (typeof score === 'number' && score > 0) {
          allScores.push(score);
        }

        // Sum up frame-by-frame stats if available
        if (gameData.frameScores && gameData.frameScores[playerIndex]) {
          const frameData = gameData.frameScores[playerIndex];
          totalStrikes += frameData.strikes || 0;
          totalSpares += frameData.spares || 0;
          totalSplits += frameData.splits || 0;
        }
      }
    });

    if (allScores.length === 0) {
      return {
        playerId,
        playerName,
        games: 0,
        totalPins: 0,
        average: 0,
        highGame: 0,
        lowGame: 0,
        strikes: 0,
        spares: 0,
        splits: 0,
        recentGames: [],
      };
    }

    // Calculate statistics
    const games = allScores.length;
    const totalPins = allScores.reduce((sum, score) => sum + score, 0);
    const average = Math.round(totalPins / games);
    const highGame = Math.max(...allScores);
    const lowGame = Math.min(...allScores);

    // Get last 5 games (most recent)
    const recentGames = allScores.slice(-5);

    console.log(`✅ Stats calculated for ${playerName}: ${games} games, ${average} avg, ${highGame} high`);

    return {
      playerId,
      playerName,
      games,
      totalPins,
      average,
      highGame,
      lowGame,
      strikes: totalStrikes,
      spares: totalSpares,
      splits: totalSplits,
      recentGames,
    };
  } catch (error) {
    console.error(`❌ Error calculating player stats:`, error);
    return null;
  }
}

/**
 * Calculate team statistics from all players' game data
 */
export async function calculateTeamStats(): Promise<TeamStats> {
  try {
    console.log(`📊 Calculating team stats for team: ${STATS_TEAM_ID}`);

    // Fetch team data to get list of players
    const teamRef = doc(statsDb, 'teams', STATS_TEAM_ID);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) {
      console.warn(`⚠️  Team ${STATS_TEAM_ID} not found`);
      return {
        totalPlayers: 0,
        teamAverage: 0,
        totalGames: 0,
        highTeamGame: 0,
        highIndividualGame: 0,
        highIndividualGamePlayer: '',
        topAverages: [],
      };
    }

    const teamData = teamSnap.data();
    const playerIds: string[] = teamData.playerIds || [];

    if (playerIds.length === 0) {
      console.log(`📭 No players in team`);
      return {
        totalPlayers: 0,
        teamAverage: 0,
        totalGames: 0,
        highTeamGame: 0,
        highIndividualGame: 0,
        highIndividualGamePlayer: '',
        topAverages: [],
      };
    }

    // Calculate stats for each player
    const playerStats = await Promise.all(
      playerIds.map(playerId => calculatePlayerStats(playerId))
    );

    // Filter out nulls and players with no games
    const validStats = playerStats.filter(
      (stats): stats is PlayerGameStats => stats !== null && stats.games > 0
    );

    if (validStats.length === 0) {
      return {
        totalPlayers: playerIds.length,
        teamAverage: 0,
        totalGames: 0,
        highTeamGame: 0,
        highIndividualGame: 0,
        highIndividualGamePlayer: '',
        topAverages: [],
      };
    }

    // Calculate team statistics
    const totalGames = validStats.reduce((sum, player) => sum + player.games, 0);
    const totalPins = validStats.reduce((sum, player) => sum + player.totalPins, 0);
    const teamAverage = Math.round(totalPins / totalGames);

    // Find highest individual game
    let highIndividualGame = 0;
    let highIndividualGamePlayer = '';
    validStats.forEach(player => {
      if (player.highGame > highIndividualGame) {
        highIndividualGame = player.highGame;
        highIndividualGamePlayer = player.playerName;
      }
    });

    // Get top 5 averages
    const topAverages = validStats
      .sort((a, b) => b.average - a.average)
      .slice(0, 5)
      .map(player => ({
        playerName: player.playerName,
        average: player.average,
      }));

    console.log(`✅ Team stats calculated: ${validStats.length} players, ${teamAverage} avg, ${totalGames} total games`);

    return {
      totalPlayers: validStats.length,
      teamAverage,
      totalGames,
      highTeamGame: 0, // TODO: Calculate from team game data if available
      highIndividualGame,
      highIndividualGamePlayer,
      topAverages,
    };
  } catch (error) {
    console.error(`❌ Error calculating team stats:`, error);
    return {
      totalPlayers: 0,
      teamAverage: 0,
      totalGames: 0,
      highTeamGame: 0,
      highIndividualGame: 0,
      highIndividualGamePlayer: '',
      topAverages: [],
    };
  }
}

/**
 * Get all player stats for the roster page
 */
export async function getAllPlayerStats(): Promise<PlayerGameStats[]> {
  try {
    console.log(`📊 Fetching all player stats for team: ${STATS_TEAM_ID}`);

    // Fetch team data to get list of players
    const teamRef = doc(statsDb, 'teams', STATS_TEAM_ID);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) {
      console.warn(`⚠️  Team ${STATS_TEAM_ID} not found`);
      return [];
    }

    const teamData = teamSnap.data();
    const playerIds: string[] = teamData.playerIds || [];

    // Calculate stats for each player
    const playerStats = await Promise.all(
      playerIds.map(playerId => calculatePlayerStats(playerId))
    );

    // Filter out nulls and sort by average (high to low)
    const validStats = playerStats
      .filter((stats): stats is PlayerGameStats => stats !== null)
      .sort((a, b) => b.average - a.average);

    console.log(`✅ Retrieved stats for ${validStats.length} players`);
    return validStats;
  } catch (error) {
    console.error(`❌ Error fetching all player stats:`, error);
    return [];
  }
}
