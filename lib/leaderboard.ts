import { safeStorage } from "./storage";

export interface ScoreEntry {
  id: string;
  nickname: string;
  characterId: string;
  characterName: string;
  score: number;
  obstacleScore: number;
  quizScore: number;
  bonusScore: number;
  zoneBonus: number;
  rankTitle: string;
  date: string;
}

const LEADERBOARD_KEY = "himanika_tech_flight_scores";
const MAX_SCORES = 50;

/**
 * High-level repository abstraction for Leaderboard.
 * Designed to seamlessly transition to an online backend (Supabase / Firebase / Postgres)
 * without breaking the UI component contracts.
 */
export const getLeaderboard = (): ScoreEntry[] => {
  const data = safeStorage.getItem(LEADERBOARD_KEY);
  if (!data) return [];
  try {
    const parsed: ScoreEntry[] = JSON.parse(data);
    return parsed.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
};

export const saveScore = (entry: Omit<ScoreEntry, "id" | "date">): ScoreEntry => {
  const current = getLeaderboard();
  
  const newEntry: ScoreEntry = {
    ...entry,
    id: `score_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SCORES);

  safeStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  return newEntry;
};

export const clearLeaderboard = (): void => {
  safeStorage.removeItem(LEADERBOARD_KEY);
};

export const getRankCategory = (score: number): { title: string; color: string } => {
  if (score >= 1000) return { title: "TECH MASTER", color: "#ffd700" };
  if (score >= 600) return { title: "GREAT PILOT", color: "#00f0ff" };
  if (score >= 300) return { title: "NICE FLIGHT", color: "#00ff9d" };
  return { title: "KEEP TRYING", color: "#94a3b8" };
};
