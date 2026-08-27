"use client";

import React, { useState } from "react";
import { LandingScreen } from "@/components/landing/LandingScreen";
import { NicknameModal } from "@/components/game/NicknameModal";
import { CharacterSelect } from "@/components/character-select/CharacterSelect";
import { OnboardingModal } from "@/components/game/OnboardingModal";
import { GameCanvas } from "@/components/game/GameCanvas";
import { GameOverModal } from "@/components/game/GameOverModal";
import { LeaderboardModal } from "@/components/leaderboard/LeaderboardModal";
import { DevModeModal } from "@/components/dev/DevModeModal";
import { CHARACTERS, Character } from "@/data/characters";
import { ScoreBreakdown } from "@/lib/game-engine";
import { saveScore, ScoreEntry, getRankCategory } from "@/lib/leaderboard";

type GameState =
  | "menu"
  | "nickname"
  | "character-select"
  | "onboarding"
  | "playing"
  | "game-over"
  | "leaderboard";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [nickname, setNickname] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [lastBreakdown, setLastBreakdown] = useState<ScoreBreakdown | null>(null);
  const [lastScoreEntry, setLastScoreEntry] = useState<ScoreEntry | null>(null);
  const [isBoothMode, setIsBoothMode] = useState<boolean>(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);

  // Transition handlers
  const handleStartGame = () => {
    setGameState("nickname");
  };

  const handleOpenLeaderboard = () => {
    setGameState("leaderboard");
  };

  const handleNicknameSubmit = (name: string) => {
    setNickname(name);
    setGameState("character-select");
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setGameState("onboarding");
  };

  const handleOnboardingComplete = () => {
    setGameState("playing");
  };

  const handleGameOver = (breakdown: ScoreBreakdown) => {
    setLastBreakdown(breakdown);

    // Save score to leaderboard repository
    const rank = getRankCategory(breakdown.totalScore);
    const entry = saveScore({
      nickname: nickname || "PILOT",
      characterId: selectedCharacter.id,
      characterName: selectedCharacter.name,
      score: breakdown.totalScore,
      obstacleScore: breakdown.obstacleScore,
      quizScore: breakdown.quizScore,
      bonusScore: breakdown.bonusScore,
      zoneBonus: breakdown.zoneBonus,
      rankTitle: rank.title,
    });

    setLastScoreEntry(entry);
    setGameState("game-over");
  };

  const handlePlayAgain = () => {
    if (!nickname) {
      setGameState("nickname");
    } else {
      setGameState("playing");
    }
  };

  const handleBackToMenu = () => {
    setGameState("menu");
  };

  return (
    <main className={`min-h-screen w-full bg-background ${isBoothMode ? "text-lg" : ""}`}>
      {gameState === "menu" && (
        <LandingScreen
          onStartGame={handleStartGame}
          onOpenLeaderboard={handleOpenLeaderboard}
          isBoothMode={isBoothMode}
          onToggleBoothMode={() => setIsBoothMode(!isBoothMode)}
          onOpenDevMode={() => setIsDevModalOpen(true)}
        />
      )}

      {gameState === "nickname" && (
        <NicknameModal
          onSubmit={handleNicknameSubmit}
          onBack={handleBackToMenu}
        />
      )}

      {gameState === "character-select" && (
        <CharacterSelect
          onSelectCharacter={handleCharacterSelect}
          onBack={() => setGameState("nickname")}
        />
      )}

      {gameState === "onboarding" && (
        <OnboardingModal onStart={handleOnboardingComplete} />
      )}

      {gameState === "playing" && (
        <GameCanvas
          character={selectedCharacter}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === "game-over" && lastBreakdown && (
        <GameOverModal
          nickname={nickname}
          character={selectedCharacter}
          breakdown={lastBreakdown}
          onPlayAgain={handlePlayAgain}
          onOpenLeaderboard={handleOpenLeaderboard}
        />
      )}

      {gameState === "leaderboard" && (
        <LeaderboardModal
          currentScoreId={lastScoreEntry?.id}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {/* Developer Mode Modal */}
      <DevModeModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
        isBoothMode={isBoothMode}
      />
    </main>
  );
}
