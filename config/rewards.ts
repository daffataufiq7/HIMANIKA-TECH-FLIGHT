export interface RewardTier {
  level: number;
  minScore: number;
  title: string;
  badge: string;
  reward: string;
  description: string;
  color: string;
}

export const REWARDS: RewardTier[] = [
  {
    level: 1,
    minScore: 300,
    title: "LEVEL 1 UNLOCKED",
    badge: "BRONZE PILOT",
    reward: "Sticker Pack HIMANIKA",
    description: "Kamu berhasil menunjukkan skill penerbangan awal dan pengetahuan tech dasar!",
    color: "#cd7f32"
  },
  {
    level: 2,
    minScore: 600,
    title: "LEVEL 2 UNLOCKED",
    badge: "SILVER PILOT",
    reward: "Merchandise Special HIMANIKA",
    description: "Luar biasa! Pemahaman teknologi dan refleks kamu di atas rata-rata!",
    color: "#c0c0c0"
  },
  {
    level: 3,
    minScore: 1000,
    title: "LEVEL 3 UNLOCKED",
    badge: "GOLD TECH MASTER",
    reward: "Grand Prize / Special Reward Booth",
    description: "SKOR MAKSIMAL! Kamu layak dinobatkan sebagai Top Tech Pilot Open House FT!",
    color: "#ffd700"
  }
];

export const getRewardForScore = (score: number): RewardTier | null => {
  const sorted = [...REWARDS].sort((a, b) => b.minScore - a.minScore);
  return sorted.find(r => score >= r.minScore) || null;
};
