"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { ZoneType, DifficultyLevel, ZONES } from "@/config/game";
import { Pause, Play, Volume2, VolumeX, Flame } from "lucide-react";

interface GameHUDProps {
  score: number;
  difficulty: DifficultyLevel;
  zone: ZoneType;
  quizProgress: number; // e.g. 2 out of 5
  streak: number;
  isPaused: boolean;
  onTogglePause: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  difficulty,
  zone,
  quizProgress,
  streak,
  isPaused,
  onTogglePause,
  soundOn,
  onToggleSound,
}) => {
  const currentZone = ZONES[zone];

  const formattedScore = String(score).padStart(4, "0");

  return (
    <div className="absolute inset-x-0 top-0 z-20 p-4 pointer-events-none flex flex-wrap items-center justify-between gap-2 select-none">
      {/* Top Left: Score & Difficulty */}
      <div className="pointer-events-auto flex items-center gap-3 bg-surface/85 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 block tracking-widest uppercase">
            SCORE
          </span>
          <span className="text-2xl md:text-3xl font-black text-cyan-400 font-mono tracking-tight">
            {formattedScore}
          </span>
        </div>
        <div className="h-8 w-px bg-slate-800 my-auto" />
        <Badge
          color={
            difficulty === "INSANE"
              ? "#ff007f"
              : difficulty === "HARD"
              ? "#ffb700"
              : difficulty === "NORMAL"
              ? "#00f0ff"
              : "#00ff9d"
          }
          variant="glow"
          size="sm"
        >
          {difficulty}
        </Badge>
      </div>

      {/* Top Center: Zone Banner */}
      <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-surface/85 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: currentZone.themeColor }}
        />
        <div>
          <span className="text-xs font-black uppercase text-white font-display block">
            {currentZone.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block -mt-0.5">
            {currentZone.subtitle}
          </span>
        </div>
      </div>

      {/* Top Right: Quiz Counter, Streak, Pause, Sound */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Streak Combo Badge */}
        {streak >= 2 && (
          <div className="bg-amber-500/20 border border-amber-400/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-bounce">
            <Flame size={16} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-amber-300 font-mono">
              x{streak} STREAK
            </span>
          </div>
        )}

        {/* Quiz Progress */}
        <div className="bg-surface/85 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">
            QUIZ
          </span>
          <span className="text-sm font-black text-emerald-400 font-mono">
            {quizProgress}/5
          </span>
        </div>

        {/* Pause Button */}
        <button
          onClick={onTogglePause}
          className="p-2.5 rounded-xl bg-surface/85 hover:bg-slate-700 border border-slate-700 text-cyan-400 backdrop-blur-md shadow-xl transition-all"
          title={isPaused ? "Resume Game" : "Pause Game"}
        >
          {isPaused ? <Play size={18} className="fill-cyan-400" /> : <Pause size={18} />}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2.5 rounded-xl bg-surface/85 hover:bg-slate-700 border border-slate-700 text-slate-300 backdrop-blur-md shadow-xl transition-all"
          title="Toggle Sound"
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}
        </button>
      </div>
    </div>
  );
};
