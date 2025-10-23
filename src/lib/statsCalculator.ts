/**
 * Stats Calculator - Calculate bowling statistics from game data
 *
 * This module fetches game data from the Stats Firebase project and calculates
 * useful statistics for players and teams.
 */

import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from './statsFirebase';

export interface GameDetail {
  score: number;
  weekDate?: string;
  timestamp?: number;
  strikeCount?: number;
  spareCount?: number;
  splitCount?: number;
  date?: Date; // Formatted date for display
}

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
  allGames: GameDetail[]; // All individual games with details

  // HYPE STATS - Series & Achievements
  highSeries: number; // Best 3-game series total
  totalSeries: number; // Number of complete 3-game series
  gamesOver25: number; // Games 25+ pins over average (USBC Bronze)
  gamesOver50: number; // Games 50+ pins over average (USBC Silver)
  gamesOver100: number; // Games 100+ pins over average (USBC Gold)
  seriesOver25: number; // Series 25+ pins over average (3-game series)
  seriesOver50: number; // Series 50+ pins over average
  seriesOver100: number; // Series 100+ pins over average
  currentStreak: number; // Games in a row above average (hot streak!)
  longestStreak: number; // Longest streak above average
  strikePercentage: number; // Strike percentage
  sparePercentage: number; // Spare conversion percentage
  last5Average: number; // Recent performance (last 5 games)
}

export interface TeamStats {
  totalPlayers: number;
  teamAverage: number;
  totalGames: number;
  highTeamGame: number;
  highIndividualGame: number;
  highIndividualGamePlayer: string;
  topAverages: Array<{ playerName: string; average: number }>;

  // HYPE STATS - Team achievements
  highTeamSeries: number; // Best combined 3-game series
  totalAchievements: number; // Total USBC achievements across all players
  activePlayers: number; // Players with games this season
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
    const playerName = playerData.name ||
                       `${playerData.firstName || ''} ${playerData.lastName || ''}`.trim() ||
                       'Unknown Player';

    // Fetch all games for this player
    // Note: Games in Stats app use playerId field (not players array)
    const gamesRef = collection(statsDb, 'games');
    const gamesQuery = query(
      gamesRef,
      where('playerId', '==', playerId)
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
        allGames: [],
        highSeries: 0,
        totalSeries: 0,
        gamesOver25: 0,
        gamesOver50: 0,
        gamesOver100: 0,
        seriesOver25: 0,
        seriesOver50: 0,
        seriesOver100: 0,
        currentStreak: 0,
        longestStreak: 0,
        strikePercentage: 0,
        sparePercentage: 0,
        last5Average: 0,
      };
    }

    // Extract all scores and organize by week (series)
    interface GameData {
      score: number;
      weekDate?: string;
      timestamp?: number;
      strikeCount?: number;
      spareCount?: number;
      splitCount?: number;
    }

    const allGames: GameData[] = [];
    let totalStrikes = 0;
    let totalSpares = 0;
    let totalSplits = 0;

    gamesSnapshot.forEach((gameDoc) => {
      const gameData = gameDoc.data();

      // Each game document has totalScore directly
      if (gameData.totalScore != null && typeof gameData.totalScore === 'number' && gameData.totalScore > 0) {
        allGames.push({
          score: gameData.totalScore,
          weekDate: gameData.weekDate,
          timestamp: gameData.timestamp,
          strikeCount: gameData.strikeCount,
          spareCount: gameData.spareCount,
          splitCount: gameData.splitCount,
        });
      }

      // Sum up frame-by-frame stats if available
      if (gameData.strikeCount) totalStrikes += gameData.strikeCount;
      if (gameData.spareCount) totalSpares += gameData.spareCount;
      if (gameData.splitCount) totalSplits += gameData.splitCount;
    });

    if (allGames.length === 0) {
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
        allGames: [],
        highSeries: 0,
        totalSeries: 0,
        gamesOver25: 0,
        gamesOver50: 0,
        gamesOver100: 0,
        seriesOver25: 0,
        seriesOver50: 0,
        seriesOver100: 0,
        currentStreak: 0,
        longestStreak: 0,
        strikePercentage: 0,
        sparePercentage: 0,
        last5Average: 0,
      };
    }

    // Sort games by timestamp for proper ordering
    allGames.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    const allScores = allGames.map(g => g.score);

    // Calculate basic statistics
    const games = allScores.length;
    const totalPins = allScores.reduce((sum, score) => sum + score, 0);
    const average = Math.round(totalPins / games);
    const highGame = Math.max(...allScores);
    const lowGame = Math.min(...allScores);

    // Get last 5 games (most recent)
    const recentGames = allScores.slice(-5);
    const last5Average = recentGames.length > 0
      ? Math.round(recentGames.reduce((sum, score) => sum + score, 0) / recentGames.length)
      : 0;

    // 🔥 SERIES TRACKING - Group games by weekDate for 3-game series
    const seriesByWeek: { [weekDate: string]: number[] } = {};
    allGames.forEach(game => {
      if (game.weekDate) {
        if (!seriesByWeek[game.weekDate]) {
          seriesByWeek[game.weekDate] = [];
        }
        seriesByWeek[game.weekDate].push(game.score);
      }
    });

    // Calculate series stats (3-game series only)
    const completeSeries = Object.values(seriesByWeek).filter(games => games.length === 3);
    const seriesTotals = completeSeries.map(games => games.reduce((sum, score) => sum + score, 0));
    const highSeries = seriesTotals.length > 0 ? Math.max(...seriesTotals) : 0;
    const totalSeries = completeSeries.length;

    // 🏆 USBC YOUTH ACHIEVEMENTS - Games over average
    const gamesOver25 = allScores.filter(score => score >= average + 25).length;
    const gamesOver50 = allScores.filter(score => score >= average + 50).length;
    const gamesOver100 = allScores.filter(score => score >= average + 100).length;

    // 🏆 USBC YOUTH ACHIEVEMENTS - Series over average (3-game series)
    const seriesAverage = average * 3; // 3-game series average
    const seriesOver25 = seriesTotals.filter(total => total >= seriesAverage + 25).length;
    const seriesOver50 = seriesTotals.filter(total => total >= seriesAverage + 50).length;
    const seriesOver100 = seriesTotals.filter(total => total >= seriesAverage + 100).length;

    // 🔥 HOT STREAK DETECTION - Games in a row above average
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate from most recent games backward for current streak
    for (let i = allScores.length - 1; i >= 0; i--) {
      if (allScores[i] >= average) {
        tempStreak++;
      } else {
        break;
      }
    }
    currentStreak = tempStreak;

    // Calculate longest streak ever
    tempStreak = 0;
    allScores.forEach(score => {
      if (score >= average) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    // 🎯 STRIKE & SPARE PERCENTAGES
    // Each game has 10 frames, 9th and 10th frames can have extra balls
    // Approximation: Total possible strikes ≈ games * 12 (conservative estimate)
    // Total possible spares ≈ games * 10 - strikes
    const totalPossibleStrikes = games * 12; // Conservative estimate
    const strikePercentage = totalPossibleStrikes > 0
      ? Math.round((totalStrikes / totalPossibleStrikes) * 100)
      : 0;

    // Spare opportunities = frames where first ball didn't strike
    const totalPossibleSpares = (games * 10) - totalStrikes;
    const sparePercentage = totalPossibleSpares > 0
      ? Math.round((totalSpares / totalPossibleSpares) * 100)
      : 0;

    console.log(`✅ Stats calculated for ${playerName}: ${games} games, ${average} avg, ${highGame} high, ${highSeries} series`);

    // Convert allGames to GameDetail format with dates
    const gamesWithDates: GameDetail[] = allGames.map(game => ({
      ...game,
      date: game.timestamp ? new Date(game.timestamp) : undefined,
    }));

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
      allGames: gamesWithDates,
      highSeries,
      totalSeries,
      gamesOver25,
      gamesOver50,
      gamesOver100,
      seriesOver25,
      seriesOver50,
      seriesOver100,
      currentStreak,
      longestStreak,
      strikePercentage,
      sparePercentage,
      last5Average,
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
        highTeamSeries: 0,
        totalAchievements: 0,
        activePlayers: 0,
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
        highTeamSeries: 0,
        totalAchievements: 0,
        activePlayers: 0,
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
        highTeamSeries: 0,
        totalAchievements: 0,
        activePlayers: 0,
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

    // 🏆 HYPE STATS - Calculate team achievements
    const highTeamSeries = Math.max(...validStats.map(p => p.highSeries), 0);

    // Total USBC achievements across all players
    const totalAchievements = validStats.reduce((sum, player) => {
      return sum +
        player.gamesOver25 +
        player.gamesOver50 +
        player.gamesOver100 +
        player.seriesOver25 +
        player.seriesOver50 +
        player.seriesOver100;
    }, 0);

    console.log(`✅ Team stats calculated: ${validStats.length} players, ${teamAverage} avg, ${totalGames} games, ${totalAchievements} achievements!`);

    return {
      totalPlayers: validStats.length,
      teamAverage,
      totalGames,
      highTeamGame: 0, // TODO: Calculate from combined team game data if available
      highIndividualGame,
      highIndividualGamePlayer,
      topAverages,
      highTeamSeries,
      totalAchievements,
      activePlayers: validStats.length,
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
      highTeamSeries: 0,
      totalAchievements: 0,
      activePlayers: 0,
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
