"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Volume2, VolumeX, Trophy, Play, Maximize, Monitor, RotateCcw, Wrench } from "lucide-react";
import { audio } from "@/lib/audio";
import { clearLeaderboard } from "@/lib/leaderboard";

interface LandingScreenProps {
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  isBoothMode: boolean;
  onToggleBoothMode: () => void;
  onOpenDevMode: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartGame,
  onOpenLeaderboard,
  isBoothMode,
  onToggleBoothMode,
  onOpenDevMode,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const [showAdminResetModal, setShowAdminResetModal] = useState<boolean>(false);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setSoundOn(audio.isEnabled());
  }, []);

  // Futuristic Background Particles Canvas
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      color: Math.random() > 0.5 ? "#00f0ff" : "#00ff9d",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle Cyber Grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleToggleSound = () => {
    const newState = audio.toggleSound();
    setSoundOn(newState);
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
      setShowAdminResetModal(true);
      setLogoClickCount(0);
    }
  };

  const handleConfirmReset = () => {
    clearLeaderboard();
    setShowAdminResetModal(false);
    audio.playButtonClick();
    alert("Local Leaderboard berhasil direset!");
  };

  const handleFullscreen = () => {
    audio.playButtonClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Canvas */}
      <canvas ref={bgCanvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Top Header Bar */}
      <header className="relative z-10 p-4 md:p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Hidden Admin Reset Trigger on Logo */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer group flex items-center gap-2"
          title="HIMANIKA FT (Tap 5x for Admin Reset)"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400 transition-all">
            <span className="font-black text-cyan-400 text-sm">H</span>
          </div>
          <div>
            <span className="font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-base md:text-lg">
              HIMANIKA
            </span>
            <span className="text-[10px] block text-slate-400 font-mono -mt-1">
              OPEN HOUSE FT
            </span>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDevMode}
            className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-cyan-500/10"
            title="Developer Mode (Kelola Soal & Engine)"
          >
            <Wrench size={16} className="text-cyan-400" />
            <span className="hidden sm:inline">DEV MODE</span>
          </button>
          <button
            onClick={handleToggleSound}
            className="p-2.5 rounded-xl bg-surface-light/80 hover:bg-slate-700 border border-slate-700 text-cyan-400 transition-all"
            title="Toggle Sound"
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}
          </button>
          <button
            onClick={onToggleBoothMode}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              isBoothMode
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : "bg-surface-light/80 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Booth Mode UI"
          >
            <Monitor size={16} />
            <span className="hidden sm:inline">BOOTH MODE</span>
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2.5 rounded-xl bg-surface-light/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
            title="Toggle Fullscreen (F11)"
          >
            <Maximize size={18} />
          </button>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-8 max-w-4xl mx-auto w-full">
        <Badge color="#00f0ff" variant="glow" className="mb-4 animate-pulse-fast">
          ⚡ OFFICIAL OPEN HOUSE FT EXHIBITION GAME
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-2 uppercase drop-shadow-[0_0_35px_rgba(0,240,255,0.4)] font-display">
          TECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">FLIGHT</span>
        </h1>

        <p className="text-cyan-400 font-extrabold text-lg md:text-2xl tracking-wide mb-6">
          Fly Further. Think Smarter.
        </p>

        {/* Hero Visual Showcase Vector */}
        <div className="relative my-4 w-44 h-44 md:w-56 md:h-56 flex items-center justify-center">
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl animate-glow-pulse" />
          <svg
            className="w-full h-full animate-float drop-shadow-[0_0_25px_rgba(0,240,255,0.8)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Holographic Ring */}
            <circle cx="50" cy="50" r="42" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            {/* Robot Drone Vector */}
            <path d="M 68 50 L 35 32 L 28 50 L 35 68 Z" fill="#0f172a" stroke="#00f0ff" strokeWidth="3" />
            <ellipse cx="55" cy="50" rx="9" ry="5" fill="#00f0ff" />
            <rect x="22" y="32" width="8" height="10" fill="#00ff9d" rx="2" />
            <rect x="22" y="58" width="8" height="10" fill="#00ff9d" rx="2" />
            {/* Plasma Thruster Flame */}
            <path d="M 22 50 L 10 46 L 6 50 L 10 54 Z" fill="#ffb700" className="animate-pulse" />
          </svg>
        </div>

        <p className="text-slate-300 text-sm md:text-base max-w-lg mb-8 leading-relaxed">
          Terbang, hindari obstacle teknologi, jawab quiz prodi HIMANIKA, dan raih skor tertinggi untuk memenangkan reward eksklusif booth!
        </p>

        {/* Main CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button size="xl" variant="primary" onClick={onStartGame} className="w-full sm:w-auto min-w-[220px]">
            <Play size={22} className="fill-black" />
            MULAI GAME
          </Button>
          <Button size="xl" variant="secondary" onClick={onOpenLeaderboard} className="w-full sm:w-auto min-w-[200px]">
            <Trophy size={20} className="text-amber-400" />
            LEADERBOARD
          </Button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-500 border-t border-slate-800/80 bg-background/80 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>🎮 HIMANIKA OPEN HOUSE showcase product</span>
          <span>•</span>
          <span>💻 3 Prodi: Teknologi Informasi, Pendidikan Teknik Informatika, Pendidikan Teknik Elektronika</span>
        </div>
      </footer>

      {/* Admin Reset Modal (Hidden 5-click easter egg) */}
      {showAdminResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-rose-500/80 p-6 rounded-2xl max-w-md w-full text-center shadow-2xl">
            <h3 className="text-xl font-black text-rose-400 mb-2 flex items-center justify-center gap-2">
              <RotateCcw size={22} />
              RESET LOCAL LEADERBOARD?
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              Tindakan admin panitia ini akan menghapus seluruh data skor lokal yang tersimpan di browser ini untuk memulai hari baru.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="secondary" onClick={() => setShowAdminResetModal(false)}>
                BATAL
              </Button>
              <Button variant="danger" onClick={handleConfirmReset}>
                RESET SEKARANG
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
