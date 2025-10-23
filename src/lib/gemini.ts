/**
 * Gemini AI Service for Stats Analysis
 * Provides AI-powered insights and analysis for bowling statistics
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface TeamStatsForAI {
  teamAverage: number;
  totalPlayers: number;
  totalGames: number;
  highGame: number;
  highGamePlayer: string;
  topPerformers: Array<{
    name: string;
    average: number;
    highGame: number;
    games: number;
  }>;
}

export interface AIInsight {
  category: 'strengths' | 'improvements' | 'trends' | 'recommendations';
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Generate AI-powered insights about team performance
 */
export async function generateTeamInsights(stats: TeamStatsForAI): Promise<AIInsight[]> {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️  Gemini API key not configured');
    return getDefaultInsights(stats);
  }

  try {
    const prompt = `You are an expert bowling coach analyzing high school team statistics. Analyze the following data and provide 4-6 specific, actionable insights.

Team Statistics:
- Team Average: ${stats.teamAverage}
- Total Players: ${stats.totalPlayers}
- Total Games Bowled: ${stats.totalGames}
- Highest Game: ${stats.highGame} (by ${stats.highGamePlayer})

Top Performers:
${stats.topPerformers.map((p, i) => `${i + 1}. ${p.name} - Average: ${p.average}, High Game: ${p.highGame}, Games: ${p.games}`).join('\n')}

Provide insights in the following categories:
1. Team Strengths (what they're doing well)
2. Areas for Improvement (specific weaknesses to address)
3. Performance Trends (patterns in the data)
4. Coaching Recommendations (actionable next steps)

Format your response as JSON array with this structure:
[
  {
    "category": "strengths" | "improvements" | "trends" | "recommendations",
    "title": "Brief title (5-8 words)",
    "description": "Specific insight with data support (2-3 sentences)",
    "confidence": "high" | "medium" | "low"
  }
]

Be specific, use the actual numbers, and make it relevant for high school bowlers.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini');
    }

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('Could not parse Gemini response as JSON');
      return getDefaultInsights(stats);
    }

    const insights: AIInsight[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${insights.length} AI insights`);
    return insights;

  } catch (error) {
    console.error('❌ Error generating AI insights:', error);
    return getDefaultInsights(stats);
  }
}

/**
 * Fallback insights based on simple heuristics
 */
function getDefaultInsights(stats: TeamStatsForAI): AIInsight[] {
  const insights: AIInsight[] = [];

  // Strength: Team size
  if (stats.totalPlayers >= 10) {
    insights.push({
      category: 'strengths',
      title: 'Strong Team Participation',
      description: `With ${stats.totalPlayers} active players, the team has excellent depth and participation. This provides good competition during practice and flexibility for lineup adjustments.`,
      confidence: 'high',
    });
  }

  // Strength: High game achievement
  if (stats.highGame >= 200) {
    insights.push({
      category: 'strengths',
      title: 'Elite High Game Performance',
      description: `${stats.highGamePlayer}'s high game of ${stats.highGame} demonstrates the team's capability to reach competitive scoring levels. This sets a strong benchmark for other players.`,
      confidence: 'high',
    });
  }

  // Improvement: Team average
  if (stats.teamAverage > 0 && stats.teamAverage < 150) {
    insights.push({
      category: 'improvements',
      title: 'Focus on Spare Conversion',
      description: `Team average of ${stats.teamAverage} suggests opportunities for improvement. Focus practice on spare shooting and first-ball accuracy to boost scores.`,
      confidence: 'medium',
    });
  }

  // Trend: Experience level
  if (stats.totalGames > 0) {
    const gamesPerPlayer = Math.round(stats.totalGames / stats.totalPlayers);
    if (gamesPerPlayer < 10) {
      insights.push({
        category: 'trends',
        title: 'Building Team Experience',
        description: `With an average of ${gamesPerPlayer} games per player, the team is still developing. Consistency should improve as players gain more competitive experience.`,
        confidence: 'medium',
      });
    }
  }

  // Recommendation: Always include practice focus
  insights.push({
    category: 'recommendations',
    title: 'Prioritize Fundamental Skills',
    description: `Continue emphasis on spare shooting, approach consistency, and mental game. Track individual progress and celebrate improvements to maintain motivation.`,
    confidence: 'high',
  });

  return insights;
}

/**
 * Generate personalized player feedback
 */
export async function generatePlayerFeedback(
  playerName: string,
  average: number,
  highGame: number,
  games: number
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return `${playerName} is averaging ${average} over ${games} games with a high game of ${highGame}. Keep up the great work and focus on consistency!`;
  }

  try {
    const prompt = `Generate a brief (2-3 sentences), encouraging, and specific feedback message for a high school bowler named ${playerName}.

Their stats:
- Average: ${average}
- High Game: ${highGame}
- Games Bowled: ${games}

Tone: Supportive, motivational, specific to their performance level. Focus on what they're doing well and one area for growth.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ||
           `Great work, ${playerName}! Keep bowling!`;

  } catch (error) {
    console.error('❌ Error generating player feedback:', error);
    return `${playerName} is performing well with an average of ${average}. Keep up the great work!`;
  }
}
