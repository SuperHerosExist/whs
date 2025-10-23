const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Stats.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('📊 Updating Stats.tsx to use calculated stats...');

// Update imports
content = content.replace(
  `import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import type { Player } from '@/types';`,
  `import React, { useEffect, useState } from 'react';
import { calculateTeamStats, getAllPlayerStats, type PlayerGameStats } from '@/lib/statsCalculator';
import type { Player } from '@/types';`
);

// Replace the entire useEffect with new calculated stats logic
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?fetchStats\(\);[\s\S]*?\}, \[\]\);/,
  `useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get calculated team stats
        const teamStatsData = await calculateTeamStats();

        setTeamStats({
          teamAverage: teamStatsData.teamAverage,
          highGame: teamStatsData.highIndividualGame,
          totalGames: teamStatsData.totalGames,
          activePlayers: teamStatsData.totalPlayers,
        });

        // Get all player stats and extract top performers
        const allPlayerStats = await getAllPlayerStats();

        // Convert to Player type for display (top 5 by average)
        const topPerformersData: Player[] = allPlayerStats
          .slice(0, 5)
          .map(stat => ({
            id: stat.playerId,
            uid: stat.playerId,
            name: stat.playerName,
            email: '',
            grade: '',
            graduationYear: new Date().getFullYear(),
            averageScore: stat.average,
            highGame: stat.highGame,
            gamesPlayed: stat.games,
            programId: 'willard-tigers',
            teamIds: [],
            isActive: true,
            photoURL: null,
            jerseyNumber: '',
            bio: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

        setTopPerformers(topPerformersData);
        console.log(\`✅ Stats page loaded: \${teamStatsData.totalPlayers} players, \${teamStatsData.teamAverage} avg\`);
      } catch (error) {
        console.error('❌ Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated Stats.tsx with calculated stats');
