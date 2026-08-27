"use client";

import React, { useState, useEffect, useRef } from "react";
import { QuizItem, getQuizzes, addQuizItem, updateQuizItem, deleteQuizItem, resetQuizzesToDefault, saveQuizzes } from "@/data/quizzes";
import { getGameConfig, saveGameConfig, resetGameConfig, GameConfig, ZONES, ZoneType } from "@/config/game";
import { clearLeaderboard } from "@/lib/leaderboard";
import { QuizModal } from "@/components/game/QuizModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Lock,
  User,
  Key,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Download,
  Upload,
  Search,
  Sliders,
  Check,
  X,
  HelpCircle,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Play
} from "lucide-react";

interface DevModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBoothMode?: boolean;
}

export const DevModeModal: React.FC<DevModeModalProps> = ({ isOpen, onClose, isBoothMode }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Tab State: "quizzes" | "tuner"
  const [activeTab, setActiveTab] = useState<"quizzes" | "tuner">("quizzes");

  // Quiz Manager State
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form State for Add/Edit
  const [formZone, setFormZone] = useState<ZoneType>("technology");
  const [formQuestion, setFormQuestion] = useState<string>("");
  const [formOptA, setFormOptA] = useState<string>("");
  const [formOptB, setFormOptB] = useState<string>("");
  const [formOptC, setFormOptC] = useState<string>("");
  const [formOptD, setFormOptD] = useState<string>("");
  const [formAnswer, setFormAnswer] = useState<number>(0);
  const [formDifficulty, setFormDifficulty] = useState<"easy" | "normal" | "hard">("easy");
  const [formExplanation, setFormExplanation] = useState<string>("");

  // Game Tuner State
  const [config, setConfig] = useState<GameConfig>(getGameConfig());

  // Test Quiz State
  const [testQuiz, setTestQuiz] = useState<QuizItem | null>(null);

  // File Input Ref for Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore auth from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = sessionStorage.getItem("himanika_dev_auth");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Sync quizzes & config on auth
  useEffect(() => {
    if (isAuthenticated) {
      setQuizzes(getQuizzes());
      setConfig(getGameConfig());
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password;

    if (cleanUser === "daffa taufiq" && cleanPass === "daffa31") {
      setIsAuthenticated(true);
      setAuthError("");
      sessionStorage.setItem("himanika_dev_auth", "true");
    } else {
      setAuthError("Kredensial salah! Username = daffa taufiq & Password = daffa31");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("himanika_dev_auth");
    setUsername("");
    setPassword("");
  };

  // Open Form for Adding New Quiz
  const handleOpenAdd = () => {
    setEditingQuiz(null);
    setFormZone("technology");
    setFormQuestion("");
    setFormOptA("");
    setFormOptB("");
    setFormOptC("");
    setFormOptD("");
    setFormAnswer(0);
    setFormDifficulty("easy");
    setFormExplanation("");
    setIsAddingNew(true);
  };

  // Open Form for Editing Quiz
  const handleOpenEdit = (q: QuizItem) => {
    setEditingQuiz(q);
    setFormZone(q.zone);
    setFormQuestion(q.question);
    setFormOptA(q.options[0] || "");
    setFormOptB(q.options[1] || "");
    setFormOptC(q.options[2] || "");
    setFormOptD(q.options[3] || "");
    setFormAnswer(q.answer);
    setFormDifficulty(q.difficulty);
    setFormExplanation(q.explanation || "");
    setIsAddingNew(true);
  };

  // Save Quiz (Create or Update)
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formOptA.trim() || !formOptB.trim() || !formOptC.trim() || !formOptD.trim()) {
      alert("Harap isi pertanyaan dan semua 4 pilihan jawaban!");
      return;
    }

    const payload = {
      zone: formZone,
      question: formQuestion.trim(),
      options: [formOptA.trim(), formOptB.trim(), formOptC.trim(), formOptD.trim()] as [string, string, string, string],
      answer: formAnswer,
      difficulty: formDifficulty,
      explanation: formExplanation.trim() || undefined,
    };

    let updatedList: QuizItem[];
    if (editingQuiz) {
      updatedList = updateQuizItem(editingQuiz.id, payload);
    } else {
      updatedList = addQuizItem(payload);
    }

    setQuizzes(updatedList);
    setIsAddingNew(false);
    setEditingQuiz(null);
  };

  // Delete Quiz
  const handleDeleteQuiz = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus soal kuis ini?")) {
      const updated = deleteQuizItem(id);
      setQuizzes(updated);
    }
  };

  // Reset Quizzes to Default
  const handleResetQuizzes = () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan seluruh daftar soal ke data awal bawaan?")) {
      const def = resetQuizzesToDefault();
      setQuizzes(def);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quizzes, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `himanika_quizzes_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          saveQuizzes(parsed);
          setQuizzes(parsed);
          alert(`Berhasil mengimpor ${parsed.length} soal kuis!`);
        } else {
          alert("Format file JSON tidak valid. Harus berisi array soal.");
        }
      } catch (err) {
        alert("Gagal membaca file JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Save Game Config Changes
  const handleConfigChange = (key: keyof GameConfig, val: number) => {
    const updated = saveGameConfig({ [key]: val });
    setConfig(updated);
  };

  // Reset Game Config
  const handleResetConfig = () => {
    const def = resetGameConfig();
    setConfig(def);
  };

  // Reset Leaderboard
  const handleResetLeaderboard = () => {
    if (confirm("Reset seluruh data skor Leaderboard lokal?")) {
      clearLeaderboard();
      alert("Leaderboard lokal berhasil dibersihkan!");
    }
  };

  // Filtered Quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    const matchZone = zoneFilter === "all" || q.zone === zoneFilter;
    const matchQuery = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchZone && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      {/* Test Quiz Overlay */}
      {testQuiz && (
        <QuizModal
          quiz={testQuiz}
          zone={testQuiz.zone}
          onAnswer={(isCorrect) => {
            alert(isCorrect ? "Jawaban Benar! 🎉" : "Jawaban Salah atau Waktu Habis! ❌");
            setTestQuiz(null);
          }}
        />
      )}

      {/* Main Container */}
      <div className="relative bg-surface border-2 border-cyan-500/80 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-950 p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
              <Wrench size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-white font-display tracking-tight">
                  DEVELOPER MODE
                </h2>
                <Badge color="#00f0ff" variant="glow">
                  HIMANIKA ENGINE
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {isAuthenticated ? "Logged in as: daffa taufiq" : "Restricted Access — Credentials Required"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Logout Developer"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* =================================================== */
          /* AUTH FORM (LOGIN DAFFA TAUFIQ / DAFFA31)           */
          /* =================================================== */
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center my-auto max-w-md mx-auto w-full">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border-2 border-cyan-400/40 flex items-center justify-center mb-6 text-cyan-400 shadow-lg shadow-cyan-500/20 animate-pulse">
              <Lock size={32} />
            </div>

            <h3 className="text-2xl font-black text-white mb-2 font-display">
              AUTENTIKASI DEVELOPER
            </h3>
            <p className="text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
              Masukkan kredensial khusus pengembang untuk mengelola bank soal kuis prodi dan parameter engine game.
            </p>

            {authError && (
              <div className="w-full mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2 text-left">
                <AlertTriangle size={18} className="shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="text-left">
                <label className="text-[11px] font-extrabold uppercase text-slate-400 block mb-1 font-mono">
                  USERNAME DEVELOPER
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: daffa taufiq"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none font-medium text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="text-[11px] font-extrabold uppercase text-slate-400 block mb-1 font-mono">
                  PASSWORD
                </label>
                <div className="relative">
                  <Key size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none font-medium text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                <ShieldCheck size={18} />
                MASUK DEVELOPER MODE
              </Button>
            </form>
          </div>
        ) : (
          /* =================================================== */
          /* DEVELOPER DASHBOARD                                 */
          /* =================================================== */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`px-5 py-3 text-xs md:text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === "quizzes"
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-xl"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <HelpCircle size={16} />
                KELOLA SOAL KUIS ({quizzes.length})
              </button>
              <button
                onClick={() => setActiveTab("tuner")}
                className={`px-5 py-3 text-xs md:text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === "tuner"
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-xl"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sliders size={16} />
                GAME TUNER & CHEATS
              </button>
            </div>

            {/* Tab 1: Quiz Management */}
            {activeTab === "quizzes" && (
              <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
                {/* Top Action & Search Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  {/* Search & Filter */}
                  <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                    <div className="relative flex-1 min-w-[180px]">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari pertanyaan..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-medium"
                      />
                    </div>

                    <select
                      value={zoneFilter}
                      onChange={(e) => setZoneFilter(e.target.value)}
                      className="py-2 px-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none font-bold"
                    >
                      <option value="all">🌐 Semua Zone Prodi</option>
                      <option value="technology">💻 Teknologi Informasi</option>
                      <option value="electronics">⚙️ Pend. Teknik Informatika</option>
                      <option value="electrical">⚡ Pend. Teknik Elektronika</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="primary" onClick={handleOpenAdd}>
                      <Plus size={16} />
                      TAMBAH SOAL
                    </Button>
                    <button
                      onClick={handleExportJSON}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Export Quizzes JSON"
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline">EXPORT</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Import Quizzes JSON"
                    >
                      <Upload size={16} />
                      <span className="hidden sm:inline">IMPORT</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportJSON}
                      accept=".json"
                      className="hidden"
                    />
                    <button
                      onClick={handleResetQuizzes}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
                      title="Reset Default Quizzes"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>

                {/* Quiz Form Modal (Add / Edit) Overlay */}
                {isAddingNew && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-surface border-2 border-cyan-500 p-6 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                          <Edit3 size={18} className="text-cyan-400" />
                          {editingQuiz ? `EDIT SOAL #${editingQuiz.id}` : "TAMBAH SOAL BARU"}
                        </h3>
                        <button
                          onClick={() => setIsAddingNew(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleSaveQuiz} className="space-y-4 text-left">
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">
                            ZONE PRODI
                          </label>
                          <select
                            value={formZone}
                            onChange={(e) => setFormZone(e.target.value as ZoneType)}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                          >
                            <option value="technology">💻 Teknologi Informasi (Zone 01)</option>
                            <option value="electronics">⚙️ Pendidikan Teknik Informatika (Zone 02)</option>
                            <option value="electrical">⚡ Pendidikan Teknik Elektronika (Zone 03)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">
                            PERTANYAAN
                          </label>
                          <textarea
                            value={formQuestion}
                            onChange={(e) => setFormQuestion(e.target.value)}
                            placeholder="Tuliskan pertanyaan kuis di sini..."
                            rows={3}
                            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:border-cyan-400 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">
                              PILIHAN A {formAnswer === 0 && "✅ (KUNCI)"}
                            </label>
                            <input
                              type="text"
                              value={formOptA}
                              onChange={(e) => setFormOptA(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">
                              PILIHAN B {formAnswer === 1 && "✅ (KUNCI)"}
                            </label>
                            <input
                              type="text"
                              value={formOptB}
                              onChange={(e) => setFormOptB(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">
                              PILIHAN C {formAnswer === 2 && "✅ (KUNCI)"}
                            </label>
                            <input
                              type="text"
                              value={formOptC}
                              onChange={(e) => setFormOptC(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">
                              PILIHAN D {formAnswer === 3 && "✅ (KUNCI)"}
                            </label>
                            <input
                              type="text"
                              value={formOptD}
                              onChange={(e) => setFormOptD(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">
                              JAWABAN BENAR (KUNCI)
                            </label>
                            <select
                              value={formAnswer}
                              onChange={(e) => setFormAnswer(Number(e.target.value))}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-300 font-extrabold text-xs"
                            >
                              <option value={0}>A. {formOptA || "Pilihan A"}</option>
                              <option value={1}>B. {formOptB || "Pilihan B"}</option>
                              <option value={2}>C. {formOptC || "Pilihan C"}</option>
                              <option value={3}>D. {formOptD || "Pilihan D"}</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">
                              TINGKAT KESULITAN
                            </label>
                            <select
                              value={formDifficulty}
                              onChange={(e) => setFormDifficulty(e.target.value as any)}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                            >
                              <option value="easy">Easy (Mudah)</option>
                              <option value="normal">Normal (Sedang)</option>
                              <option value="hard">Hard (Sulit)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">
                            PENJELASAN (OPSIONAL)
                          </label>
                          <input
                            type="text"
                            value={formExplanation}
                            onChange={(e) => setFormExplanation(e.target.value)}
                            placeholder="Alasan jawaban benar..."
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                          <Button variant="secondary" size="sm" onClick={() => setIsAddingNew(false)}>
                            BATAL
                          </Button>
                          <Button variant="primary" size="sm" type="submit">
                            SIMPAN SOAL
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Quizzes Scrollable List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      Tidak ada soal yang cocok dengan pencarian / filter.
                    </div>
                  ) : (
                    filteredQuizzes.map((q) => {
                      const zoneInfo = ZONES[q.zone];
                      return (
                        <div
                          key={q.id}
                          className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg">
                                #{q.id}
                              </span>
                              <span
                                className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg"
                                style={{ backgroundColor: `${zoneInfo.themeColor}20`, color: zoneInfo.themeColor }}
                              >
                                {zoneInfo.subtitle}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                                [{q.difficulty}]
                              </span>
                            </div>

                            <p className="text-sm font-extrabold text-white mb-3">
                              {q.question}
                            </p>

                            {/* 4 Options Preview */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                              {q.options.map((opt, idx) => (
                                <div
                                  key={idx}
                                  className={`p-2 rounded-xl border flex items-center gap-2 ${
                                    idx === q.answer
                                      ? "bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-bold"
                                      : "bg-slate-900/50 border-slate-800 text-slate-400"
                                  }`}
                                >
                                  <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-300 shrink-0">
                                    {["A", "B", "C", "D"][idx]}
                                  </span>
                                  <span className="truncate">{opt}</span>
                                  {idx === q.answer && <Check size={14} className="text-emerald-400 ml-auto shrink-0" />}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              onClick={() => setTestQuiz(q)}
                              className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all"
                              title="Uji Tampil Kuis ini"
                            >
                              <Play size={14} />
                              <span>TEST</span>
                            </button>
                            <button
                              onClick={() => handleOpenEdit(q)}
                              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
                              title="Edit Soal"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuiz(q.id)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all"
                              title="Hapus Soal"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Game Tuner & Cheats */}
            {activeTab === "tuner" && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Leaderboard Reset Action */}
                <div className="bg-slate-950/80 border border-rose-500/30 p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-rose-400 uppercase tracking-wide flex items-center gap-2">
                      <Trash2 size={16} />
                      RESET LEADERBOARD LOKAL
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Hapus seluruh data skor tertinggi lokal untuk memulai sesi booth baru.
                    </p>
                  </div>
                  <Button variant="danger" size="sm" onClick={handleResetLeaderboard}>
                    RESET SEKARANG
                  </Button>
                </div>

                {/* Physics & Game Rules Tuner */}
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wide flex items-center gap-2 font-display">
                      <Sliders size={16} />
                      PENGATURAN ENGINE PERMAINAN (DYNAMIC CONFIG)
                    </h4>
                    <button
                      onClick={handleResetConfig}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <RotateCcw size={12} />
                      RESET DEFAULTS
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="text-xs font-extrabold text-slate-300 block mb-1 font-mono">
                        INTERVAL KUIS (Setiap Berapa Obstacle): {config.quizInterval}
                      </label>
                      <input
                        type="range"
                        min={2}
                        max={10}
                        step={1}
                        value={config.quizInterval}
                        onChange={(e) => handleConfigChange("quizInterval", Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500">Default: 5 obstacles</span>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-300 block mb-1 font-mono">
                        TIMER KUIS (Detik Mengerjakan): {config.quizTimeLimit}s
                      </label>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        step={1}
                        value={config.quizTimeLimit}
                        onChange={(e) => handleConfigChange("quizTimeLimit", Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500">Default: 10 detik</span>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-300 block mb-1 font-mono">
                        GRAVITASI ROBOT: {config.gravity}
                      </label>
                      <input
                        type="range"
                        min={0.2}
                        max={0.8}
                        step={0.02}
                        value={config.gravity}
                        onChange={(e) => handleConfigChange("gravity", Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500">Default: 0.42</span>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-300 block mb-1 font-mono">
                        KECEPATAN OBSTACLE: {config.baseObstacleSpeed}
                      </label>
                      <input
                        type="range"
                        min={1.5}
                        max={5.0}
                        step={0.1}
                        value={config.baseObstacleSpeed}
                        onChange={(e) => handleConfigChange("baseObstacleSpeed", Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500">Default: 2.8</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
