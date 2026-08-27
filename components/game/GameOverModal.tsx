"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoreBreakdown } from "@/lib/game-engine";
import { Character } from "@/data/characters";
import { getRankCategory } from "@/lib/leaderboard";
import { RewardCardModal } from "@/components/rewards/RewardCardModal";
import { Trophy, RotateCcw, Share2, Award } from "lucide-react";
import confetti from "canvas-confetti";

interface GameOverModalProps {
  nickname: string;
  character: Character;
  breakdown: ScoreBreakdown;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  nickname,
  character,
  breakdown,
  onPlayAgain,
  onOpenLeaderboard,
}) => {
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  const rank = getRankCategory(breakdown.totalScore);

  // Trigger confetti if high score >= 300
  React.useEffect(() => {
    if (breakdown.totalScore >= 300) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [breakdown.totalScore]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border-2 border-rose-500/80 p-6 md:p-8 rounded-3xl max-w-md w-full text-slate-100 shadow-2xl text-center animate-glow-pulse">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-display mb-1 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
          GAME OVER
        </h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
          MISSILE FLIGHT TERMINATED
        </p>

        {/* Player & Rank Badge */}
        <div className="mb-6">
          <span className="text-lg font-black text-white uppercase font-display block">
            {nickname}
          </span>
          <Badge color={rank.color} variant="glow" className="mt-1">
            <Award size={14} />
            {rank.title}
          </Badge>
        </div>

        {/* Big Total Score Display */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl mb-6">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
            FINAL SCORE
          </span>
          <span className="text-5xl font-black text-cyan-400 font-mono tracking-tight">
            {breakdown.totalScore}
          </span>
        </div>

        {/* Score Breakdown Table */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-6 text-xs space-y-2 font-mono">
          <div className="flex justify-between text-slate-300">
            <span>Obstacle Score</span>
            <span className="font-bold text-white">+{breakdown.obstacleScore}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Quiz Score</span>
            <span className="font-bold text-emerald-400">+{breakdown.quizScore}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Streak Bonus</span>
            <span className="font-bold text-amber-400">+{breakdown.bonusScore}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Zone Completion Bonus</span>
            <span className="font-bold text-cyan-400">+{breakdown.zoneBonus}</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex justify-between font-black text-sm text-white">
            <span>TOTAL SCORE</span>
            <span className="text-cyan-400">{breakdown.totalScore}</span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="space-y-3">
          <Button
            size="lg"
            variant="accent"
            onClick={() => setShowRewardModal(true)}
            className="w-full"
          >
            <Share2 size={18} />
            SIMPAN HASIL / LIHAT REWARD
          </Button>

          <div className="flex gap-3">
            <Button
              size="md"
              variant="secondary"
              onClick={onOpenLeaderboard}
              className="w-1/2"
            >
              <Trophy size={18} className="text-amber-400" />
              LEADERBOARD
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={onPlayAgain}
              className="w-1/2"
            >
              <RotateCcw size={18} />
              MAIN LAGI
            </Button>
          </div>
        </div>
      </div>

      {/* Share / Certificate Modal */}
      {showRewardModal && (
        <RewardCardModal
          nickname={nickname}
          character={character}
          breakdown={breakdown}
          onClose={() => setShowRewardModal(false)}
        />
      )}
    </div>
  );
};
