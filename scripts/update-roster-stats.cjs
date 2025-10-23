const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Roster.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('📊 Updating Roster.tsx to use calculated stats...');

// Update imports
content = content.replace(
  `import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import type { Player } from '@/types';`,
  `import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import { getAllPlayerStats, type PlayerGameStats } from '@/lib/statsCalculator';
import type { Player } from '@/types';`
);

// Update state to include PlayerGameStats
content = content.replace(
  `export const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);`,
  `export const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerGameStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);`
);

// Update the fetchPlayers function to also fetch calculated stats
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?fetchPlayers\(\);[\s\S]*?\}, \[\]\);/,
  `useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Fetch calculated player stats from game data
        const calculatedStats = await getAllPlayerStats();
        const statsMap = new Map<string, PlayerGameStats>();
        calculatedStats.forEach(stat => {
          statsMap.set(stat.playerId, stat);
        });
        setPlayerStats(statsMap);

        // Fetch team players for additional info (name, photo, etc.)
        const teamRef = doc(statsDb, 'teams', STATS_TEAM_ID);
        const teamSnap = await getDoc(teamRef);

        if (!teamSnap.exists()) {
          console.error('❌ Team not found');
          setLoading(false);
          return;
        }

        const teamData = teamSnap.data();
        const playerIds = teamData?.playerIds || [];

        // Fetch each player individually
        const playersData: Player[] = [];
        for (const playerId of playerIds) {
          try {
            const playerRef = doc(statsDb, 'players', playerId);
            const playerSnap = await getDoc(playerRef);

            if (playerSnap.exists()) {
              const data = playerSnap.data();
              const stats = statsMap.get(playerId);

              playersData.push({
                id: playerSnap.id,
                uid: data.uid || playerSnap.id,
                name: \`\${data.firstName || ''} \${data.lastName || ''}\`.trim() || 'Unknown Player',
                email: data.email || '',
                grade: data.grade || '',
                graduationYear: data.graduationYear || new Date().getFullYear(),
                averageScore: stats?.average || 0,
                highGame: stats?.highGame || 0,
                gamesPlayed: stats?.games || 0,
                programId: 'willard-tigers',
                teamIds: data.teamIds || [STATS_TEAM_ID],
                isActive: data.isActive !== false,
                photoURL: data.photoURL || null,
                jerseyNumber: data.jerseyNumber || '',
                bio: data.bio || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              });
            }
          } catch (playerError) {
            console.warn(\`⚠️  Could not fetch player \${playerId}:\`, playerError);
          }
        }

        // Sort by average score descending
        playersData.sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));

        setPlayers(playersData);
        console.log(\`✅ Loaded \${playersData.length} players with calculated stats\`);
      } catch (error) {
        console.error('❌ Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated Roster.tsx with calculated stats');
