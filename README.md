# HIMANIKA TECH FLIGHT 🚀

> **Fly Further. Think Smarter.**

Official web mini-game arcade showcase created for the **HIMANIKA Booth** at the **Open House Fakultas Teknik**.

---

## 🎮 Game Overview

**HIMANIKA TECH FLIGHT** is a fast-paced tech arcade mini-game inspired by classic flight mechanics, rebuilt with 100% original futuristic visuals, prodi-themed characters, dynamic tech zones, interactive quizzes, and local booth leaderboards.

### 🌟 Key Features
- **3 HIMANIKA Prodi Characters**:
  1. `TECH PILOT` (Teknologi Informasi) — *Code. Create. Innovate.*
  2. `CIRCUIT PILOT` (Pendidikan Teknik Informatika) — *Teach. Tech. Transform.*
  3. `POWER PILOT` (Pendidikan Teknik Elektronika) — *Circuit. Power. Innovate.*
- **3 Dynamic Tech Zones**:
  - **Zone 01 — Technology**: Teknologi Informasi (Programming, web, software engineering, and computer science quizzes).
  - **Zone 02 — Informatics**: Pendidikan Teknik Informatika (Computation, algorithms, microcontrollers, and educational tech quizzes).
  - **Zone 03 — Electronics**: Pendidikan Teknik Elektronika (Circuits, power systems, sensors, and electronic component quizzes).
- **Quick Quiz Interruption**: Every 5 obstacles, gameplay pauses for a 7-second quick quiz. Correct answers award **+50 PTS** and streak multipliers.
- **Web Audio API Synth Engine**: 100% procedural retro arcade sound effects without external audio file dependencies.
- **Booth Mode & Fullscreen**: Optimized for booth laptop/monitor display with large touch/keyboard controls and Fullscreen mode (F11).
- **Leaderboard & Digital Reward Certificate**: Local score persistence (`localStorage`) with printable pilot certificate cards for booth reward redemption (Level 1: 300+, Level 2: 600+, Level 3: 1000+).

---

## 🚀 Quick Start (Local Development)

### 1. Installation

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

### 3. Production Build

```bash
npm run build
npm start
```

---

## ⚡ Deployment to Vercel

This repository is **100% Vercel-ready** without requiring any backend, database, environment variables, or API keys.

### Steps to Deploy:

1. Push this repository to **GitHub**.
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New Project"** and import your repository.
4. Keep all default build settings (`Framework: Next.js`).
5. Click **"Deploy"**.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Glassmorphic Arcade UI
- **Physics & Gameplay Engine**: HTML5 Canvas (`lib/game-engine.ts`)
- **Sound Engine**: Web Audio API (`lib/audio.ts`)
- **Icons**: Lucide React
- **Storage**: `localStorage` with SSR-safe fallback wrapper (`lib/storage.ts`)

---

## 🔒 Admin Reset Easter Egg

To reset the local leaderboard at the start of a new Open House day:
- **Click the HIMANIKA logo on the landing screen 5 times**.
- A confirmation prompt will appear to wipe the local leaderboard.

---

© HIMANIKA Fakultas Teknik — Showcase Product
