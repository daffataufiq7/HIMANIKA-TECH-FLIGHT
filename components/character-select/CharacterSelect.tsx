"use client";

import React, { useState } from "react";
import { CHARACTERS, Character } from "@/data/characters";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Shield, Zap, Cpu, Code, ArrowLeft } from "lucide-react";

interface CharacterSelectProps {
  onSelectCharacter: (character: Character) => void;
  onBack: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onSelectCharacter,
  onBack,
}) => {
  const [selectedId, setSelectedId] = useState<string>(CHARACTERS[0].id);

  const selectedChar = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code size={20} />;
      case "Cpu":
        return <Cpu size={20} />;
      case "Zap":
        return <Zap size={20} />;
      default:
        return <Shield size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background text-slate-100 flex flex-col justify-between overflow-y-auto p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-bold"
        >
          <ArrowLeft size={18} />
          KEMBALI
        </button>
        <Badge color="#00f0ff" variant="glow">
          PRODI HIMANIKA SHOWCASE
        </Badge>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center my-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-display mb-2">
            PILIH <span className="text-cyan-400">PILOT</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Pilih robot/drone yang merepresentasikan program studi HIMANIKA favoritmu!
          </p>
        </div>

        {/* 3 Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {CHARACTERS.map((char) => {
            const isSelected = char.id === selectedId;

            return (
              <div
                key={char.id}
                onClick={() => setSelectedId(char.id)}
                className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-surface-light/90 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.3)] scale-105"
                    : "bg-surface/60 border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100"
                }`}
              >
                {/* Selected Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-cyan-400 text-black p-1.5 rounded-full shadow-lg">
                    <Check size={16} className="stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${char.color}20`, color: char.color }}
                    >
                      {renderIcon(char.accentIcon)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block font-mono">
                        {char.prodi}
                      </span>
                      <h3 className="text-xl font-black uppercase text-white font-display">
                        {char.name}
                      </h3>
                    </div>
                  </div>

                  <p
                    className="text-xs font-bold tracking-wide italic mb-4"
                    style={{ color: char.color }}
                  >
                    &ldquo;{char.tagline}&rdquo;
                  </p>

                  {/* Character Vector Preview */}
                  <div className="w-full h-36 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center p-4 mb-4 relative overflow-hidden group">
                    <div
                      className="absolute inset-0 opacity-20 blur-xl transition-all group-hover:opacity-40"
                      style={{ backgroundColor: char.color }}
                    />
                    <svg
                      className="w-24 h-24 relative z-10 animate-float"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <path
                        d="M 65 50 L 35 32 L 28 50 L 35 68 Z"
                        fill="#0f172a"
                        stroke={char.color}
                        strokeWidth="3"
                      />
                      <ellipse cx="55" cy="50" rx="9" ry="5" fill={char.color} />
                      <rect x="22" y="32" width="8" height="10" fill={char.secondaryColor} rx="2" />
                      <rect x="22" y="58" width="8" height="10" fill={char.secondaryColor} rx="2" />
                      <path d="M 22 50 L 10 46 L 6 50 L 10 54 Z" fill="#ffb700" />
                    </svg>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {char.description}
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>AGILITY</span>
                    <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${char.stats.agility}%`, backgroundColor: char.color }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>SENSOR</span>
                    <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${char.stats.sensor}%`, backgroundColor: char.color }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>POWER</span>
                    <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${char.stats.power}%`, backgroundColor: char.color }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation CTA */}
        <div className="flex justify-center">
          <Button
            size="xl"
            variant="primary"
            onClick={() => onSelectCharacter(selectedChar)}
            className="w-full sm:w-auto min-w-[260px]"
          >
            KONFIRMASI PILOT
          </Button>
        </div>
      </div>
    </div>
  );
};
