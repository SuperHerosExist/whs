const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('📊 Updating Home.tsx to use calculated stats...');

// Replace imports
content = content.replace(
  `import React, { useEffect, useState } from 'react';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Zap, Star, Calendar } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import { practiceSchedule } from '@/config/practice-schedule';`,
  `import React, { useEffect, useState } from 'react';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Zap, Star, Calendar } from 'lucide-react';
import { calculateTeamStats } from '@/lib/statsCalculator';
import { practiceSchedule } from '@/config/practice-schedule';`
);

// Replace state and useEffect
content = content.replace(
  /const \[liveStats, setLiveStats\] = useState\(\{[\s\S]*?\}\);[\s\S]*?useEffect\(\(\) => \{[\s\S]*?fetchLiveStats\(\);[\s\S]*?\}, \[\]\);/,
  `const [liveStats, setLiveStats] = useState({
    teamAverage: 0,
    totalMembers: 0,
    totalGames: 0,
    highIndividualGame: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        setLoading(true);
        const teamStats = await calculateTeamStats();

        setLiveStats({
          teamAverage: teamStats.teamAverage,
          totalMembers: teamStats.totalPlayers,
          totalGames: teamStats.totalGames,
          highIndividualGame: teamStats.highIndividualGame,
        });

        console.log(\`✅ Home: \${teamStats.totalPlayers} players, \${teamStats.teamAverage} avg, \${teamStats.totalGames} games\`);
      } catch (error) {
        console.error('❌ Error fetching home stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStats();
  }, []);`
);

// Replace stats array to use new values
content = content.replace(
  /const stats = \[[\s\S]*?\{ icon: Target, label: 'Championships'[^\]]*\]/,
  `const stats = [
    { icon: TrendingUp, label: 'Team Average', value: liveStats.teamAverage, emoji: '📊', gradient: 'from-willard-grey-800 to-willard-black' },
    { icon: Users, label: 'Active Athletes', value: liveStats.totalMembers, emoji: '👥', gradient: 'from-willard-grey-700 to-willard-grey-900' },
    { icon: Trophy, label: 'Total Games', value: liveStats.totalGames, emoji: '🎳', gradient: 'from-willard-grey-600 to-willard-grey-800' },
    { icon: Target, label: 'High Game', value: liveStats.highIndividualGame, emoji: '🎯', gradient: 'from-willard-black to-willard-grey-900' }
  ]`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated Home.tsx with calculated stats');
