"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { GameEngine, ScoreBreakdown } from "@/lib/game-engine";
import { Character } from "@/data/characters";
import { ZoneType, DifficultyLevel } from "@/config/game";
import { QuizItem, getRandomQuizForZone } from "@/data/quizzes";
import { GameHUD } from "./GameHUD";
import { QuizModal } from "./QuizModal";
import { audio } from "@/lib/audio";

interface GameCanvasProps {
  character: Character;
  onGameOver: (breakdown: ScoreBreakdown) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ character, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // HUD & Game State
  const [score, setScore] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("EASY");
  const [zone, setZone] = useState<ZoneType>("technology");
  const [quizProgress, setQuizProgress] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [usedQuizIds, setUsedQuizIds] = useState<number[]>([]);

  useEffect(() => {
    setSoundOn(audio.isEnabled());
  }, []);

  // Flap control handler
  const handleFlap = useCallback(() => {
    if (engineRef.current && !activeQuiz) {
      engineRef.current.flap();
    }
  }, [activeQuiz]);

  // Window resize & canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resizeCanvas();
      }
    };
    window.addEventListener("resize", handleResize);

    // Initialize Game Engine
    const engine = new GameEngine(canvas, character, {
      onScoreUpdate: (newScore, newDiff) => {
        setScore(newScore);
        setDifficulty(newDiff);
      },
      onQuizTrigger: (currentZone) => {
        const quiz = getRandomQuizForZone(currentZone, usedQuizIds);
        setActiveQuiz(quiz);
        setUsedQuizIds((prev) => [...prev, quiz.id]);
        setQuizProgress((prev) => (prev >= 5 ? 1 : prev + 1));
      },
      onZoneChange: (newZone) => {
        setZone(newZone);
      },
      onGameOver: (breakdown) => {
        onGameOver(breakdown);
      },
      onStreakUpdate: (newStreak) => {
        setStreak(newStreak);
      },
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.destroy();
    };
  }, [character, onGameOver]);

  // Keyboard & Click input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        handleFlap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlap]);

  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    handleFlap();
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    setActiveQuiz(null);
    if (engineRef.current) {
      engineRef.current.handleQuizAnswer(isCorrect);
      engineRef.current.resume();
    }
  };

  const handleTogglePause = () => {
    if (!engineRef.current) return;
    if (isPaused) {
      engineRef.current.resume();
      setIsPaused(false);
    } else {
      engineRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleToggleSound = () => {
    const newState = audio.toggleSound();
    setSoundOn(newState);
  };

  return (
    <div
      className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none cursor-pointer"
      onMouseDown={handleCanvasClick}
      onTouchStart={handleCanvasClick}
    >
      {/* HTML5 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Game HUD */}
      <GameHUD
        score={score}
        difficulty={difficulty}
        zone={zone}
        quizProgress={quizProgress}
        streak={streak}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
      />

      {/* Touch / Click Hint Overlay at start */}
      <div className="absolute bottom-6 inset-x-0 pointer-events-none text-center">
        <span className="inline-block bg-surface/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-slate-300 backdrop-blur-sm animate-pulse">
          TAP SCREEN / PRESS SPACE TO FLY 🚀
        </span>
      </div>

      {/* Quiz Modal Overlay */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          zone={zone}
          onAnswer={handleQuizAnswer}
        />
      )}

      {/* Pause Screen Overlay */}
      {isPaused && !activeQuiz && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-4xl font-black uppercase text-white font-display mb-4">
              PAUSED
            </h2>
            <button
              onClick={handleTogglePause}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase tracking-wider transition-all"
            >
              RESUME GAME
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
