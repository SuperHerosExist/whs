import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID, STATS_PROGRAM_ID } from '@/lib/statsFirebase';

export const Debug: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, message]);
  };

  useEffect(() => {
    const diagnose = async () => {
      addLog('🔍 Starting diagnosis...');
      addLog(`Team ID from env: ${STATS_TEAM_ID}`);
      addLog(`Program ID from env: ${STATS_PROGRAM_ID}`);

      try {
        // Test 1: Check if our specific team exists (skipping teams list check)
        // Note: We can't list all teams due to security rules, but we can access our specific team
        addLog('\n📁 Test 1: Checking our team...');
        const teamRef = doc(statsDb, 'teams', STATS_TEAM_ID);
        const teamSnap = await getDoc(teamRef);
        if (teamSnap.exists()) {
          addLog(`✅ Team exists! Data: ${JSON.stringify(teamSnap.data())}`);
        } else {
          addLog(`❌ Team ${STATS_TEAM_ID} does NOT exist`);
        }

        // Test 2: Check players subcollection
        addLog('\n📁 Test 2: Checking players subcollection...');
        const playersRef = collection(statsDb, 'teams', STATS_TEAM_ID, 'players');
        const playersSnap = await getDocs(playersRef);
        addLog(`Found ${playersSnap.size} players in subcollection`);

        if (playersSnap.size > 0) {
          playersSnap.docs.slice(0, 5).forEach(doc => {
            const data = doc.data();
            addLog(`  - ${data.name || 'Unknown'} (avg: ${data.average || data.averageScore || 'N/A'})`);
          });
        } else {
          addLog('⚠️  No players in subcollection - checking root players collection instead...');
        }

        // Test 3: Fetch players by ID from team's playerIds array
        addLog('\n📁 Test 3: Fetching players by ID...');
        const teamData = teamSnap.data();
        const teamPlayerIds = teamData?.playerIds || [];
        addLog(`Team has ${teamPlayerIds.length} playerIds in array`);

        // Fetch each player individually by ID
        const teamPlayers = [];
        for (const playerId of teamPlayerIds.slice(0, 5)) {
          try {
            const playerRef = doc(statsDb, 'players', playerId);
            const playerSnap = await getDoc(playerRef);
            if (playerSnap.exists()) {
              teamPlayers.push({ id: playerSnap.id, ...playerSnap.data() });
              addLog(`  ✅ ${playerSnap.data().name || 'Unknown'}`);
            } else {
              addLog(`  ⚠️  Player ${playerId} not found`);
            }
          } catch (e: any) {
            addLog(`  ❌ Error fetching ${playerId}: ${e.message}`);
          }
        }

        addLog(`\n✅ Successfully fetched ${teamPlayers.length} players`);

        // Test 4: Check if Mila Collins is in the data
        addLog('\n📁 Test 4: Looking for Mila Collins...');
        const mila = teamPlayers.find((p: any) =>
          p.name?.toLowerCase().includes('mila collins')
        );
        if (mila) {
          addLog(`✅ Found Mila Collins!`);
          addLog(`   Grade: ${(mila as any).grade || 'N/A'}`);
          addLog(`   Average: ${(mila as any).average || 'N/A'}`);
          addLog(`   High Game: ${(mila as any).highGame || 'N/A'}`);
          addLog(`   Player ID: ${mila.id}`);
        } else {
          addLog(`❌ Mila Collins not found`);
        }

        addLog('\n✅ Diagnosis complete!');
      } catch (error: any) {
        addLog(`\n❌ ERROR: ${error.message}`);
        addLog(`Full error: ${JSON.stringify(error)}`);
      } finally {
        setLoading(false);
      }
    };

    diagnose();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">🔍 Firebase Stats App Diagnosis</h1>
      <p className="mb-4 text-gray-400">
        Checking connection to bowlingstatstracker database...
      </p>

      <div className="bg-black rounded-lg p-4 border border-green-600">
        {loading && <div className="text-yellow-400">⏳ Running tests...</div>}
        {logs.map((log, idx) => (
          <div key={idx} className="py-1">
            {log}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Environment Variables:</h2>
        <pre className="text-sm">
          VITE_STATS_FIREBASE_PROJECT_ID: {import.meta.env.VITE_STATS_FIREBASE_PROJECT_ID}
          {'\n'}VITE_STATS_TEAM_ID: {import.meta.env.VITE_STATS_TEAM_ID}
          {'\n'}VITE_STATS_PROGRAM_ID: {import.meta.env.VITE_STATS_PROGRAM_ID}
        </pre>
      </div>
    </div>
  );
};
