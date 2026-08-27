"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { User, ArrowRight, X } from "lucide-react";

interface NicknameModalProps {
  onSubmit: (nickname: string) => void;
  onBack: () => void;
}

export const NicknameModal: React.FC<NicknameModalProps> = ({ onSubmit, onBack }) => {
  const [inputVal, setInputVal] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();

    if (!trimmed) {
      setError("Nickname tidak boleh kosong!");
      return;
    }
    if (trimmed.length < 2) {
      setError("Nickname minimal 2 karakter!");
      return;
    }
    if (trimmed.length > 12) {
      setError("Nickname maksimal 12 karakter!");
      return;
    }

    setError("");
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-surface border border-slate-700 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl text-slate-100 animate-glow-pulse">
        {/* Close / Back button */}
        <button
          onClick={onBack}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <User size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase font-display">
            SIAP TERBANG?
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Masukkan nickname kamu untuk mendaftar di leaderboard booth.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              NICKNAME PILOT
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={12}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Contoh: Daffa"
                className="w-full bg-slate-900 border-2 border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-slate-600 outline-none transition-all"
                autoFocus
              />
              <span className="absolute right-3 top-3.5 text-xs font-mono text-slate-500">
                {inputVal.trim().length}/12
              </span>
            </div>
            {error && <p className="text-rose-400 text-xs font-bold mt-2">{error}</p>}
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="secondary" onClick={onBack} className="w-1/3">
              BATAL
            </Button>
            <Button type="submit" variant="primary" className="w-2/3">
              LANJUT
              <ArrowRight size={18} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
