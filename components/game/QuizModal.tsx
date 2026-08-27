"use client";

import React, { useState, useEffect } from "react";
import { QuizItem } from "@/data/quizzes";
import { ZONES, ZoneType } from "@/config/game";
import { HelpCircle, CheckCircle, XCircle, Clock } from "lucide-react";

interface QuizModalProps {
  quiz: QuizItem;
  zone: ZoneType;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, zone, onAnswer }) => {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "timeout" | null>(null);

  const zoneInfo = ZONES[zone];

  // 10-second Timer
  useEffect(() => {
    if (feedback !== null) return; // Stop timer on selection

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [feedback]);

  const handleTimeout = () => {
    setFeedback("timeout");
    setTimeout(() => {
      onAnswer(false);
    }, 1200);
  };

  const handleSelectOption = (index: number) => {
    if (feedback !== null) return; // Prevent double select

    setSelectedIndex(index);
    const isCorrect = index === quiz.answer;
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1300);
  };

  const getOptionStyle = (index: number) => {
    if (feedback === null) {
      return "bg-slate-900/90 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-slate-100";
    }
    if (index === quiz.answer) {
      return "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(0,255,157,0.4)]";
    }
    if (selectedIndex === index && index !== quiz.answer) {
      return "bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]";
    }
    return "bg-slate-950/50 border-slate-800 text-slate-500 opacity-60";
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-surface border-2 border-cyan-500/80 p-6 md:p-8 rounded-3xl max-w-xl w-full shadow-2xl text-slate-100 animate-glow-pulse">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <HelpCircle size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                QUICK QUIZ
              </span>
              <span
                className="text-xs font-bold font-mono"
                style={{ color: zoneInfo.themeColor }}
              >
                {zoneInfo.name}
              </span>
            </div>
          </div>

          {/* Timer Countdown Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl">
            <Clock size={16} className="text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className={`font-mono font-black text-base ${timeLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {String(timeLeft).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Question Box */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl mb-6">
          <p className="text-base md:text-lg font-extrabold text-white leading-snug">
            {quiz.question}
          </p>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {quiz.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={feedback !== null}
              className={`w-full text-left p-3.5 rounded-2xl border-2 font-bold text-sm transition-all duration-150 flex items-center justify-between gap-3 ${getOptionStyle(
                idx
              )}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-black text-xs text-slate-300">
                  {optionLabels[idx]}
                </span>
                <span>{opt}</span>
              </div>
              {feedback !== null && idx === quiz.answer && (
                <CheckCircle size={20} className="text-emerald-400 shrink-0" />
              )}
              {feedback !== null && selectedIndex === idx && idx !== quiz.answer && (
                <XCircle size={20} className="text-rose-400 shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-center font-black text-base tracking-wider uppercase animate-bounce ${
              feedback === "correct"
                ? "bg-emerald-500/20 border border-emerald-400 text-emerald-300"
                : "bg-rose-500/20 border border-rose-500 text-rose-300"
            }`}
          >
            {feedback === "correct" && "✨ CORRECT! +50 POINTS"}
            {feedback === "incorrect" && "❌ NOT QUITE!"}
            {feedback === "timeout" && "⏰ TIME'S UP!"}
          </div>
        )}
      </div>
    </div>
  );
};
