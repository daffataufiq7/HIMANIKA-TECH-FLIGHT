"use client";

import React, { useEffect, useState } from "react";
import { getLeaderboard, ScoreEntry } from "@/lib/leaderboard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Medal, ArrowLeft, Play, Sparkles } from "lucide-react";

interface LeaderboardModalProps {
  currentScoreId?: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentScoreId,
  onPlayAgain,
  onBackToMenu,
}) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(getLeaderboard());
  }, []);

  const top10 = scores.slice(0, 10);

  const getRankBadge = (rankIndex: number) => {
    if (rankIndex === 0) return <Medal size={20} className="text-amber-400 fill-amber-400" />;
    if (rankIndex === 1) return <Medal size={20} className="text-slate-300 fill-slate-300" />;
    if (rankIndex === 2) return <Medal size={20} className="text-amber-600 fill-amber-600" />;
    return <span className="font-black text-slate-500 font-mono text-sm">#{rankIndex + 1}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background text-slate-100 flex flex-col justify-between p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-bold"
          >
            <ArrowLeft size={18} />
            MENU UTAMA
          </button>
          <Badge color="#ffb700" variant="glow">
            TOP PILOTS OPEN HOUSE
          </Badge>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Trophy size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-display">
            🏆 LEADERBOARD
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Papan skor tertinggi pilot HIMANIKA TECH FLIGHT
          </p>
        </div>

        {/* Leaderboard Table / Empty State */}
        {top10.length === 0 ? (
          <div className="bg-surface border border-slate-800 p-8 rounded-3xl text-center max-w-md mx-auto w-full my-8">
            <Sparkles size={40} className="mx-auto text-cyan-400 mb-3 animate-pulse" />
            <h3 className="text-lg font-black text-white uppercase font-display mb-2">
              BELUM ADA SKOR
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Belum ada pilot yang masuk leaderboard. Jadilah yang pertama meraih skor tertinggi!
            </p>
            <Button size="lg" variant="primary" onClick={onPlayAgain} className="w-full">
              <Play size={18} className="fill-black" />
              MULAI GAME
            </Button>
          </div>
        ) : (
          <div className="bg-surface/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl mb-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                    <th className="py-3 px-3 w-12 text-center">POS</th>
                    <th className="py-3 px-4">PLAYER PILOT</th>
                    <th className="py-3 px-4 hidden sm:table-cell">PRODI / KARAKTER</th>
                    <th className="py-3 px-4 text-right">SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {top10.map((item, index) => {
                    const isCurrent = item.id === currentScoreId;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isCurrent
                            ? "bg-cyan-500/20 text-cyan-300 font-bold border-l-4 border-l-cyan-400"
                            : index % 2 === 0
                            ? "bg-slate-900/40"
                            : "bg-transparent"
                        }`}
                      >
                        <td className="py-3.5 px-3 text-center flex justify-center items-center">
                          {getRankBadge(index)}
                        </td>
                        <td className="py-3.5 px-4 font-black uppercase text-white font-display">
                          {item.nickname}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                              YOU
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 hidden sm:table-cell text-slate-400 text-xs">
                          {item.characterName}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black font-mono text-cyan-400 text-base md:text-lg">
                          {item.score}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-center gap-4">
          <Button size="lg" variant="secondary" onClick={onBackToMenu}>
            MENU UTAMA
          </Button>
          <Button size="lg" variant="primary" onClick={onPlayAgain}>
            <Play size={18} className="fill-black" />
            MAIN LAGI
          </Button>
        </div>
      </div>
    </div>
  );
};
