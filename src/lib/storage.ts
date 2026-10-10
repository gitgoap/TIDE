// Storage utility for localStorage operations
const STORAGE_KEYS = {
  CHAT_HISTORY: 'office-buddy-chat-history',
  INSIGHTS_ENABLED: 'office-buddy-insights-enabled',
  MOOD_DATA: 'office-buddy-mood-data',
  STRESS_MAP: 'office-buddy-stress-map',
  REALITY_CHECKS: 'office-buddy-reality-checks',
  MANAGER_PROFILE: 'office-buddy-manager-profile',
  REFLECTIONS: 'office-buddy-reflections',
  COPING_STRATEGIES: 'office-buddy-coping-strategies',
} as const;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode?: 'chat' | 'manager-practice' | 'manager-roast' | 'emergency' | 'reality-check';
}

export interface MoodEntry {
  date: string;
  score: number;
  note?: string;
}

export interface StressCategory {
  name: string;
  level: number; // 0-100
  observations: string[];
}

export interface StressMap {
  categories: StressCategory[];
  connections: { from: string; to: string; note: string }[];
  lastUpdated: number;
}

export interface RealityCheck {
  id: string;
  timestamp: number;
  whatHappened: string;
  assumptions: string[];
  alternatives: string[];
  nextStep: string;
}

export interface ManagerProfile {
  personality: string;
  situations: string[];
}

export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

// Chat history
export function getChatHistory(): ChatMessage[] {
  return getItem<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY, []);
}

export function saveChatHistory(messages: ChatMessage[]): void {
  setItem(STORAGE_KEYS.CHAT_HISTORY, messages);
}

export function clearChatHistory(): void {
  removeItem(STORAGE_KEYS.CHAT_HISTORY);
}

// Insights opt-in
export function getInsightsEnabled(): boolean {
  return getItem<boolean>(STORAGE_KEYS.INSIGHTS_ENABLED, false);
}

export function setInsightsEnabled(enabled: boolean): void {
  setItem(STORAGE_KEYS.INSIGHTS_ENABLED, enabled);
}

// Realistic demo defaults for first-time visitors / hackathon presentation
export const DEFAULT_MOOD_DATA: MoodEntry[] = [
  { date: '2026-09-28', score: 8, note: 'Good sleep & lighter workload' },
  { date: '2026-10-01', score: 7, note: 'Productive 1-on-1 with team lead' },
  { date: '2026-10-04', score: 7, note: 'Clear sprint goals' },
  { date: '2026-10-07', score: 5, note: 'Unexpected urgent deliverables' },
  { date: '2026-10-10', score: 6, note: 'Grounded reset with TIDE' },
];

export const DEFAULT_STRESS_MAP: StressMap = {
  categories: [
    { name: 'Work', level: 75, observations: ['High ticket backlog', 'Urgent sprint shift'] },
    { name: 'Well-being', level: 68, observations: ['Average 5.5 hours sleep', 'Afternoon fatigue'] },
    { name: 'Personal Life', level: 55, observations: ['Skipped gym sessions', 'Evening screen time'] },
    { name: 'Relationships', level: 38, observations: ['Supportive partner, slight tiredness'] },
    { name: 'Family', level: 30, observations: ['Calm, regular check-in call'] },
  ],
  connections: [
    { from: 'Work', to: 'Well-being', note: 'Higher workloads correlate with reduced sleep quality' },
    { from: 'Work', to: 'Personal Life', note: 'Overtime encroaches on evening decompression time' },
  ],
  lastUpdated: Date.now() - 3600000 * 4,
};

export const DEFAULT_REALITY_CHECKS: RealityCheck[] = [
  {
    id: 'rc-default-1',
    timestamp: Date.now() - 86400000,
    whatHappened: 'You were assigned 3 extra urgent tasks this week during the team standup.',
    assumptions: [
      'Your manager might be testing your limits or micromanaging you.',
      'If you ask for priority adjustments, you will be seen as unreliable.',
    ],
    alternatives: [
      'The client brought forward quarterly milestone deliverables across all pods.',
      'Your manager trusts your execution over newer engineers on critical tickets.',
    ],
    nextStep: 'Proactively schedule a 10-minute touchpoint: "If we expedite A, should B or C shift to next sprint?"',
  },
  {
    id: 'rc-default-2',
    timestamp: Date.now() - 86400000 * 3,
    whatHappened: 'A colleague sent a one-word "k" response on Slack after you submitted your design proposal.',
    assumptions: [
      'They hated the proposal and are upset with you.',
      'There is passive-aggressive workplace tension brewing.',
    ],
    alternatives: [
      'They were typing on mobile between back-to-back meetings.',
      'They simply acknowledged receipt before diving into a client call.',
    ],
    nextStep: 'Give it 24 hours. If needed, politely ask: "Let me know if you want to walk through sections 2 & 3 together."',
  },
];

export const DEFAULT_REFLECTIONS: string[] = [
  'Your stress surges aren\'t caused by your competence, but by undefined boundaries around sudden priorities. Taking 2 minutes to breathe before responding restores your autonomy.',
  'You seem to feel noticeably more centered on days with protected 30-minute lunch breaks away from Slack and email notifications.',
];

export const DEFAULT_COPING_STRATEGIES: string[] = [
  '2-minute physiological sigh breathing reset before stressful meetings',
  'Drafting high-emotion responses in private notes before sending on Slack/email',
  'Setting Slack to "In Focus / In Flow" from 2:00 PM to 4:00 PM',
  'Clarifying trade-offs: "Which of these 3 tickets has top priority for EOD?"',
];

// Mood data
export function getMoodData(): MoodEntry[] {
  const data = getItem<MoodEntry[] | null>(STORAGE_KEYS.MOOD_DATA, null);
  if (!data || data.length === 0) return DEFAULT_MOOD_DATA;
  return data;
}

export function saveMoodEntry(entry: MoodEntry): void {
  const data = [...getMoodData()];
  const existingIdx = data.findIndex(d => d.date === entry.date);
  if (existingIdx >= 0) {
    data[existingIdx] = entry;
  } else {
    data.push(entry);
  }
  // Keep last 30 entries
  setItem(STORAGE_KEYS.MOOD_DATA, data.slice(-30));
}

// Stress map
export function getStressMap(): StressMap {
  const map = getItem<StressMap | null>(STORAGE_KEYS.STRESS_MAP, null);
  if (!map || !map.categories || map.categories.length === 0) return DEFAULT_STRESS_MAP;
  return map;
}

export function saveStressMap(map: StressMap): void {
  setItem(STORAGE_KEYS.STRESS_MAP, map);
}

// Reality checks
export function getRealityChecks(): RealityCheck[] {
  const checks = getItem<RealityCheck[] | null>(STORAGE_KEYS.REALITY_CHECKS, null);
  if (!checks || checks.length === 0) return DEFAULT_REALITY_CHECKS;
  return checks;
}

export function saveRealityCheck(check: RealityCheck): void {
  const checks = [...getRealityChecks()];
  checks.push(check);
  setItem(STORAGE_KEYS.REALITY_CHECKS, checks.slice(-10));
}

// Manager profile
export function getManagerProfile(): ManagerProfile | null {
  return getItem<ManagerProfile | null>(STORAGE_KEYS.MANAGER_PROFILE, null);
}

export function saveManagerProfile(profile: ManagerProfile): void {
  setItem(STORAGE_KEYS.MANAGER_PROFILE, profile);
}

// Reflections
export function getReflections(): string[] {
  const refs = getItem<string[] | null>(STORAGE_KEYS.REFLECTIONS, null);
  if (!refs || refs.length === 0) return DEFAULT_REFLECTIONS;
  return refs;
}

export function saveReflection(reflection: string): void {
  const reflections = [...getReflections()];
  reflections.push(reflection);
  setItem(STORAGE_KEYS.REFLECTIONS, reflections.slice(-10));
}

// Coping strategies
export function getCopingStrategies(): string[] {
  const strats = getItem<string[] | null>(STORAGE_KEYS.COPING_STRATEGIES, null);
  if (!strats || strats.length === 0) return DEFAULT_COPING_STRATEGIES;
  return strats;
}

export function saveCopingStrategies(strategies: string[]): void {
  setItem(STORAGE_KEYS.COPING_STRATEGIES, strategies);
}

// Reset to default demo data
export function resetToDemoData(): void {
  setItem(STORAGE_KEYS.MOOD_DATA, DEFAULT_MOOD_DATA);
  setItem(STORAGE_KEYS.STRESS_MAP, DEFAULT_STRESS_MAP);
  setItem(STORAGE_KEYS.REALITY_CHECKS, DEFAULT_REALITY_CHECKS);
  setItem(STORAGE_KEYS.REFLECTIONS, DEFAULT_REFLECTIONS);
  setItem(STORAGE_KEYS.COPING_STRATEGIES, DEFAULT_COPING_STRATEGIES);
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => removeItem(key));
}

export { STORAGE_KEYS };
