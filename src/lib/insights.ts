import { ChatMessage, saveStressMap, saveRealityCheck, saveReflection, saveCopingStrategies, saveMoodEntry, getInsightsEnabled, StressMap, RealityCheck } from './storage';
import { INSIGHT_EXTRACTION_PROMPT } from './prompts';

export async function extractAndSaveInsights(messages: ChatMessage[]) {
  if (!getInsightsEnabled()) return;

  try {
    // Only analyze the recent conversation chunk
    const recentMessages = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    const conversationText = recentMessages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: INSIGHT_EXTRACTION_PROMPT },
          { role: 'user', content: conversationText }
        ],
        mode: 'insight-extraction'
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    // Parse the JSON response
    let insights;
    try {
      // Try to extract JSON from the response
      const jsonMatch = data.message.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        insights = JSON.parse(data.message);
      }
    } catch {
      console.warn('Could not parse insights JSON');
      return;
    }

    // Save stress categories
    if (insights.stressCategories && Array.isArray(insights.stressCategories)) {
      const stressMap: StressMap = {
        categories: insights.stressCategories.map((cat: { name: string; level: number; observations: string[] }) => ({
          name: cat.name || 'Unknown',
          level: Math.min(100, Math.max(0, cat.level || 0)),
          observations: cat.observations || []
        })),
        connections: (insights.connections || []).map((conn: { from: string; to: string; note: string }) => ({
          from: conn.from || '',
          to: conn.to || '',
          note: conn.note || ''
        })),
        lastUpdated: Date.now()
      };
      saveStressMap(stressMap);
    }

    // Save reality check
    if (insights.realityCheck) {
      const rc: RealityCheck = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        whatHappened: insights.realityCheck.whatHappened || '',
        assumptions: insights.realityCheck.assumptions || [],
        alternatives: insights.realityCheck.alternatives || [],
        nextStep: insights.realityCheck.nextStep || ''
      };
      saveRealityCheck(rc);
    }

    // Save reflection
    if (insights.reflection) {
      saveReflection(insights.reflection);
    }

    // Save coping strategies
    if (insights.copingStrategies && insights.copingStrategies.length > 0) {
      saveCopingStrategies(insights.copingStrategies);
    }

    // Save mood estimate
    if (insights.moodEstimate) {
      const today = new Date().toISOString().split('T')[0];
      saveMoodEntry({
        date: today,
        score: Math.min(10, Math.max(1, insights.moodEstimate))
      });
    }

  } catch (error) {
    console.error('Insight extraction error:', error);
    // Fail silently — insights are optional
  }
}
