export interface GameConfig {
  gravity: number;
  flapStrength: number;
  terminalVelocity: number;
  baseObstacleSpeed: number;
  baseObstacleGap: number;
  minObstacleGap: number;
  obstacleSpacing: number;
  scorePerObstacle: number;
  quizBonus: number;
  streakBonusThreshold: number;
  streakBonusPoints: number;
  zoneBonusPoints: number;
  quizInterval: number; // Obstacles between quizzes
  quizTimeLimit: number; // Seconds to answer quiz
  postQuizGraceObstacles: number; // Obstacles allowed to pass safely after quiz
}

export const GAME_CONFIG: GameConfig = {
  gravity: 0.42,
  flapStrength: -8.2,
  terminalVelocity: 10,
  baseObstacleSpeed: 2.8,
  baseObstacleGap: 170,
  minObstacleGap: 125,
  obstacleSpacing: 260,
  scorePerObstacle: 10,
  quizBonus: 50,
  streakBonusThreshold: 3,
  streakBonusPoints: 100,
  zoneBonusPoints: 100,
  quizInterval: 5,
  quizTimeLimit: 10,
  postQuizGraceObstacles: 2, // Number of obstacles player can pass through safely after quiz
};

const GAME_CONFIG_KEY = "himanika_custom_game_config";

export const getGameConfig = (): GameConfig => {
  if (typeof window === "undefined") return GAME_CONFIG;
  try {
    const saved = localStorage.getItem(GAME_CONFIG_KEY);
    if (saved) {
      return { ...GAME_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load custom game config", e);
  }
  return GAME_CONFIG;
};

export const saveGameConfig = (config: Partial<GameConfig>): GameConfig => {
  const current = getGameConfig();
  const updated = { ...current, ...config };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(GAME_CONFIG_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save game config", e);
    }
  }
  return updated;
};

export const resetGameConfig = (): GameConfig => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GAME_CONFIG_KEY);
  }
  return GAME_CONFIG;
};


export type ZoneType = 'technology' | 'electronics' | 'electrical';

export interface ZoneInfo {
  id: ZoneType;
  name: string;
  subtitle: string;
  themeColor: string;
  secondaryColor: string;
  bgGradient: string[];
  obstacles: string[];
}

export const ZONES: Record<ZoneType, ZoneInfo> = {
  technology: {
    id: 'technology',
    name: 'ZONE 01 — TECHNOLOGY',
    subtitle: 'Teknologi Informasi (TI)',
    themeColor: '#00f0ff',
    secondaryColor: '#3b82f6',
    bgGradient: ['#080c14', '#0f172a', '#1e1b4b'],
    obstacles: ['Server Stack', 'Cloud Node', 'Data Stream'],
  },
  electronics: {
    id: 'electronics',
    name: 'ZONE 02 — INFORMATICS',
    subtitle: 'Pendidikan Teknik Informatika (PTI)',
    themeColor: '#00ff9d',
    secondaryColor: '#10b981',
    bgGradient: ['#061a14', '#062e24', '#0f382c'],
    obstacles: ['Circuit Wall', 'Microchip Barrier', 'Sensor Gate'],
  },
  electrical: {
    id: 'electrical',
    name: 'ZONE 03 — ELECTRONICS',
    subtitle: 'Pendidikan Teknik Elektronika (PTE)',
    themeColor: '#ffb700',
    secondaryColor: '#f59e0b',
    bgGradient: ['#1c1305', '#2b1c09', '#422006'],
    obstacles: ['Energy Core', 'Transformer Tower', 'High Power Line'],
  },
};

export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD' | 'INSANE';

export interface DifficultyInfo {
  level: DifficultyLevel;
  minScore: number;
  speedMultiplier: number;
  gapMultiplier: number;
  color: string;
}

export const DIFFICULTIES: DifficultyInfo[] = [
  { level: 'EASY', minScore: 0, speedMultiplier: 1.0, gapMultiplier: 1.0, color: '#00ff9d' },
  { level: 'NORMAL', minScore: 200, speedMultiplier: 1.25, gapMultiplier: 0.9, color: '#00f0ff' },
  { level: 'HARD', minScore: 500, speedMultiplier: 1.5, gapMultiplier: 0.8, color: '#ffb700' },
  { level: 'INSANE', minScore: 800, speedMultiplier: 1.8, gapMultiplier: 0.72, color: '#ff007f' },
];
