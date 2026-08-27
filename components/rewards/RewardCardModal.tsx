"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoreBreakdown } from "@/lib/game-engine";
import { Character } from "@/data/characters";
import { getRewardForScore } from "@/config/rewards";
import { getRankCategory } from "@/lib/leaderboard";
import { Trophy, Download, Printer, X, ShieldCheck } from "lucide-react";

interface RewardCardModalProps {
  nickname: string;
  character: Character;
  breakdown: ScoreBreakdown;
  onClose: () => void;
}

export const RewardCardModal: React.FC<RewardCardModalProps> = ({
  nickname,
  character,
  breakdown,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const reward = getRewardForScore(breakdown.totalScore);
  const rank = getRankCategory(breakdown.totalScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-lg w-full flex flex-col items-center">
        {/* Printable Card */}
        <div
          ref={cardRef}
          className="w-full bg-slate-950 border-4 border-cyan-500/80 p-6 md:p-8 rounded-3xl text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.4)] relative overflow-hidden select-none"
        >
          {/* Subtle Background Watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <svg className="w-64 h-64 text-cyan-400" viewBox="0 0 100 100" fill="currentColor">
              <path d="M 65 50 L 35 32 L 28 50 L 35 68 Z" />
            </svg>
          </div>

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 font-black text-lg">
                H
              </div>
              <div>
                <h4 className="text-base font-black text-white uppercase tracking-wider font-display">
                  HIMANIKA TECH FLIGHT
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono block">
                  OFFICIAL OPEN HOUSE FT CERTIFICATE
                </span>
              </div>
            </div>
            <Badge color={rank.color} variant="glow">
              {rank.title}
            </Badge>
          </div>

          {/* Pilot Info */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                PILOT NICKNAME
              </span>
              <span className="text-2xl font-black text-white uppercase font-display">
                {nickname}
              </span>
              <span className="text-xs text-cyan-400 block font-mono">
                {character.name} ({character.prodi})
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                FINAL SCORE
              </span>
              <span className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
                {breakdown.totalScore}
              </span>
            </div>
          </div>

          {/* Score breakdown metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-6">
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Obstacles Passed:</span>
              <span className="font-bold text-white font-mono">{breakdown.obstaclesPassed}</span>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Quiz Accuracy:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {breakdown.quizzesCorrect}/{breakdown.quizzesAnswered}
              </span>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Quiz Points:</span>
              <span className="font-bold text-cyan-400 font-mono">+{breakdown.quizScore}</span>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Max Streak:</span>
              <span className="font-bold text-amber-400 font-mono">🔥 {breakdown.maxStreak}</span>
            </div>
          </div>

          {/* Reward Status */}
          {reward ? (
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/80 p-4 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-sm uppercase mb-1">
                <Trophy size={18} />
                {reward.title} — REWARD UNLOCKED
              </div>
              <p className="text-lg font-black text-white">{reward.reward}</p>
              <p className="text-xs text-amber-200/80 mt-1">{reward.description}</p>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center text-xs text-slate-400">
              Capai skor 300+ untuk membukan reward Level 1 Booth HIMANIKA!
            </div>
          )}

          {/* Stamp footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>VERIFIED BY HIMANIKA TECH FLIGHT ENGINE</span>
            </div>
            <span>{new Date().toLocaleDateString("id-ID")}</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
          <Button variant="secondary" size="md" onClick={handlePrint}>
            <Printer size={18} />
            PRINT / SIMPAN
          </Button>
          <Button variant="primary" size="md" onClick={onClose}>
            <X size={18} />
            TUTUP
          </Button>
        </div>
      </div>
    </div>
  );
};
