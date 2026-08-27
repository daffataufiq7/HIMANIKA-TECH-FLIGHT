"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Zap, HelpCircle, Trophy, MousePointer } from "lucide-react";

interface OnboardingModalProps {
  onStart: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onStart }) => {
  const [countdown, setCountdown] = useState<number>(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface border-2 border-cyan-500/60 p-6 md:p-8 rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl text-center animate-glow-pulse">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-white font-display mb-1">
          CARA BERMAIN
        </h2>
        <p className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-6">
          HOW TO PLAY
        </p>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 text-left">
          <div className="bg-slate-900/80 border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <MousePointer size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">
                SPACE / TAP
              </span>
              <span className="font-extrabold text-sm text-white">TERBANG (FLY)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <Zap size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">
                AVOID
              </span>
              <span className="font-extrabold text-sm text-white">OBSTACLES</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <HelpCircle size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">
                JAWAB QUIZ
              </span>
              <span className="font-extrabold text-sm text-white">+50 BONUS</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Trophy size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">
                GET
              </span>
              <span className="font-extrabold text-sm text-white">HIGH SCORE</span>
            </div>
          </div>
        </div>

        <Button size="lg" variant="primary" onClick={onStart} className="w-full">
          SIAP TERBANG! {countdown > 0 ? `(${countdown}s)` : ""}
        </Button>
      </div>
    </div>
  );
};
