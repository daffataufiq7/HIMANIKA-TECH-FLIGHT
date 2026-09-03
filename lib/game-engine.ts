import { GAME_CONFIG, ZONES, DIFFICULTIES, ZoneType, DifficultyLevel } from "@/config/game";
import { Character } from "@/data/characters";
import { audio } from "./audio";

export interface ScoreBreakdown {
  obstacleScore: number;
  quizScore: number;
  bonusScore: number;
  zoneBonus: number;
  totalScore: number;
  obstaclesPassed: number;
  quizzesAnswered: number;
  quizzesCorrect: number;
  maxStreak: number;
}

export interface GameCallbacks {
  onScoreUpdate: (score: number, difficulty: DifficultyLevel) => void;
  onQuizTrigger: (zone: ZoneType) => void;
  onZoneChange: (zone: ZoneType) => void;
  onGameOver: (breakdown: ScoreBreakdown) => void;
  onStreakUpdate: (streak: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  text?: string;
}

interface Obstacle {
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  gap: number;
  passed: boolean;
  type: string;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private character: Character;
  private callbacks: GameCallbacks;

  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;

  // Player physics
  public player = {
    x: 100,
    y: 250,
    radius: 18,
    vy: 0,
    angle: 0,
  };

  // World state
  private obstacles: Obstacle[] = [];
  private particles: Particle[] = [];
  private distanceTraveled: number = 0;

  // Scoring & Progression
  private obstacleScore: number = 0;
  private quizScore: number = 0;
  private bonusScore: number = 0;
  private zoneBonus: number = 0;
  
  private obstaclesPassedCount: number = 0;
  private quizzesAnsweredCount: number = 0;
  private quizzesCorrectCount: number = 0;
  private currentStreak: number = 0;
  private maxStreak: number = 0;

  private currentZone: ZoneType = "technology";
  private currentDifficulty: DifficultyLevel = "EASY";
  private ghostObstaclesRemaining: number = 0;

  constructor(canvas: HTMLCanvasElement, character: Character, callbacks: GameCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get 2d context from canvas");
    this.ctx = context;
    this.character = character;
    this.callbacks = callbacks;

    this.resizeCanvas();
    this.resetState();
  }

  public resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
      this.player.x = Math.min(120, this.canvas.width * 0.25);
    }
  }

  private resetState() {
    this.player.y = this.canvas.height / 2;
    this.player.vy = 0;
    this.player.angle = 0;

    this.obstacles = [];
    this.particles = [];
    this.distanceTraveled = 0;

    this.obstacleScore = 0;
    this.quizScore = 0;
    this.bonusScore = 0;
    this.zoneBonus = 0;

    this.obstaclesPassedCount = 0;
    this.quizzesAnsweredCount = 0;
    this.quizzesCorrectCount = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;

    this.currentZone = "technology";
    this.currentDifficulty = "EASY";
    this.ghostObstaclesRemaining = 0;
  }

  public start() {
    this.resetState();
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    audio.playButtonClick();
    this.loop(this.lastTime);
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  private lastFlapTime: number = 0;

  public flap() {
    if (!this.isRunning || this.isPaused) return;

    // Mobile tap touch debounce (prevent erratic multi-flaps on single physical tap)
    const now = performance.now();
    if (now - this.lastFlapTime < 85) return;
    this.lastFlapTime = now;

    this.player.vy = GAME_CONFIG.flapStrength;
    this.player.angle = -0.45; // ~25 deg tilt up
    audio.playFlap();

    // Spawn thruster particles
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: this.player.x - 12,
        y: this.player.y + (Math.random() * 8 - 4),
        vx: -(Math.random() * 3 + 2),
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 5 + 3,
        color: this.character.color,
        alpha: 0.9,
        life: 0,
        maxLife: 20 + Math.random() * 10
      });
    }
  }

  public handleQuizAnswer(isCorrect: boolean) {
    this.quizzesAnsweredCount++;

    // Activate post-quiz ghost mode (pass safely through 2 obstacles)
    this.ghostObstaclesRemaining = GAME_CONFIG.postQuizGraceObstacles || 2;

    this.particles.push({
      x: this.player.x,
      y: this.player.y - 50,
      vx: 0,
      vy: -1.2,
      size: 16,
      color: "#00f0ff",
      alpha: 1,
      life: 0,
      maxLife: 75,
      text: `🛡️ SHIELD MODE (${this.ghostObstaclesRemaining} PASSES)`
    });

    if (isCorrect) {
      this.quizzesCorrectCount++;
      this.currentStreak++;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }
      this.callbacks.onStreakUpdate(this.currentStreak);

      this.quizScore += GAME_CONFIG.quizBonus;
      audio.playQuizCorrect();

      // Floating text particle
      this.particles.push({
        x: this.player.x,
        y: this.player.y - 30,
        vx: 0,
        vy: -1.5,
        size: 18,
        color: "#00ff9d",
        alpha: 1,
        life: 0,
        maxLife: 60,
        text: `+${GAME_CONFIG.quizBonus} QUIZ!`
      });

      // Streak Bonus check
      if (this.currentStreak > 0 && this.currentStreak % GAME_CONFIG.streakBonusThreshold === 0) {
        this.bonusScore += GAME_CONFIG.streakBonusPoints;
        audio.playCombo();
        this.particles.push({
          x: this.player.x,
          y: this.player.y - 55,
          vx: 0,
          vy: -1.8,
          size: 20,
          color: "#ffb700",
          alpha: 1,
          life: 0,
          maxLife: 70,
          text: `🔥 STREAK x${this.currentStreak} +${GAME_CONFIG.streakBonusPoints}!`
        });
      }
    } else {
      this.currentStreak = 0;
      this.callbacks.onStreakUpdate(0);
      audio.playQuizWrong();
      this.particles.push({
        x: this.player.x,
        y: this.player.y - 30,
        vx: 0,
        vy: -1,
        size: 16,
        color: "#ff007f",
        alpha: 1,
        life: 0,
        maxLife: 50,
        text: "NOT QUITE!"
      });
    }

    this.notifyScoreUpdate();
  }

  private getTotalScore(): number {
    return this.obstacleScore + this.quizScore + this.bonusScore + this.zoneBonus;
  }

  private updateDifficultyAndZone() {
    const total = this.getTotalScore();

    // Zone calculation
    let newZone: ZoneType = "technology";
    if (total >= 500) {
      newZone = "electrical";
    } else if (total >= 250) {
      newZone = "electronics";
    }

    if (newZone !== this.currentZone) {
      this.currentZone = newZone;
      this.zoneBonus += GAME_CONFIG.zoneBonusPoints;
      this.callbacks.onZoneChange(newZone);
      audio.playZoneTransition();

      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 3,
        vx: 0,
        vy: -0.5,
        size: 24,
        color: ZONES[newZone].themeColor,
        alpha: 1,
        life: 0,
        maxLife: 90,
        text: `⚡ ${ZONES[newZone].name} UNLOCKED!`
      });
    }

    // Difficulty calculation
    let newDiff: DifficultyLevel = "EASY";
    for (let i = DIFFICULTIES.length - 1; i >= 0; i--) {
      if (total >= DIFFICULTIES[i].minScore) {
        newDiff = DIFFICULTIES[i].level;
        break;
      }
    }
    this.currentDifficulty = newDiff;
  }

  private notifyScoreUpdate() {
    this.updateDifficultyAndZone();
    this.callbacks.onScoreUpdate(this.getTotalScore(), this.currentDifficulty);
  }

  private getSpeedAndGap() {
    const diffInfo = DIFFICULTIES.find(d => d.level === this.currentDifficulty) || DIFFICULTIES[0];
    const speed = GAME_CONFIG.baseObstacleSpeed * diffInfo.speedMultiplier;
    const gap = Math.max(
      GAME_CONFIG.minObstacleGap,
      GAME_CONFIG.baseObstacleGap * diffInfo.gapMultiplier
    );
    const spacing = Math.max(
      280,
      GAME_CONFIG.obstacleSpacing / diffInfo.speedMultiplier
    );
    return { speed, gap, spacing };
  }

  private loop = (timestamp: number) => {
    if (!this.isRunning || this.isPaused) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // cap at 20fps equivalent delta
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const { speed, gap, spacing } = this.getSpeedAndGap();

    // 1. Player Physics
    this.player.vy += GAME_CONFIG.gravity;
    if (this.player.vy > GAME_CONFIG.terminalVelocity) {
      this.player.vy = GAME_CONFIG.terminalVelocity;
    }
    this.player.y += this.player.vy;

    // Tilt player angle smoothly
    if (this.player.vy > 2) {
      this.player.angle = Math.min(1.2, this.player.angle + 0.06); // tilt down
    }

    // Canvas boundary check
    if (this.player.y - this.player.radius <= 0 || this.player.y + this.player.radius >= this.canvas.height) {
      this.triggerGameOver();
      return;
    }

    // 2. Obstacles Spawning & Movement
    this.distanceTraveled += speed;

    // Spawn obstacle if needed
    const lastObstacle = this.obstacles[this.obstacles.length - 1];
    if (!lastObstacle || (this.canvas.width - lastObstacle.x) >= spacing) {
      const minTop = 80;
      const maxTop = Math.max(minTop + 40, this.canvas.height - gap - 80);
      const topHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;

      const zoneInfo = ZONES[this.currentZone];
      const typeName = zoneInfo.obstacles[Math.floor(Math.random() * zoneInfo.obstacles.length)];

      this.obstacles.push({
        x: this.canvas.width + 20,
        width: 64,
        topHeight,
        bottomY: topHeight + gap,
        gap,
        passed: false,
        type: typeName
      });
    }

    // Move & check collision for each obstacle
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= speed;

      // Check if passed player
      if (!obs.passed && obs.x + obs.width < this.player.x) {
        obs.passed = true;
        this.obstaclesPassedCount++;
        this.obstacleScore += GAME_CONFIG.scorePerObstacle;
        this.notifyScoreUpdate();
        audio.playScore();

        // Decrement ghost mode remaining counter if active
        if (this.ghostObstaclesRemaining > 0) {
          this.ghostObstaclesRemaining--;
        }

        // Spawn pass particle
        this.particles.push({
          x: this.player.x,
          y: this.player.y - 15,
          vx: 0,
          vy: -1,
          size: 14,
          color: ZONES[this.currentZone].themeColor,
          alpha: 1,
          life: 0,
          maxLife: 30,
          text: `+${GAME_CONFIG.scorePerObstacle}`
        });

        // Trigger Quiz every `quizInterval` obstacles
        if (this.obstaclesPassedCount % GAME_CONFIG.quizInterval === 0) {
          this.pause();
          this.callbacks.onQuizTrigger(this.currentZone);
          return;
        }
      }

      // Collision Check
      if (this.checkCollision(obs)) {
        this.triggerGameOver();
        return;
      }

      // Remove off-screen obstacles
      if (obs.x + obs.width < -100) {
        this.obstacles.splice(i, 1);
      }
    }

    // 3. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private checkCollision(obs: Obstacle): boolean {
    // Post-quiz grace period: allow player to safely pass through obstacles!
    if (this.ghostObstaclesRemaining > 0) {
      return false;
    }

    const px = this.player.x;
    const py = this.player.y;
    const pr = this.player.radius - 7; // Generous 7px grace margin for fair and fun gameplay

    // Top pipe rectangle check
    const inTopX = px + pr > obs.x && px - pr < obs.x + obs.width;
    const inTopY = py - pr < obs.topHeight;
    if (inTopX && inTopY) return true;

    // Bottom pipe rectangle check
    const inBottomX = px + pr > obs.x && px - pr < obs.x + obs.width;
    const inBottomY = py + pr > obs.bottomY;
    if (inBottomX && inBottomY) return true;

    return false;
  }

  private triggerGameOver() {
    this.isRunning = false;
    audio.playCrash();

    // Spawn explosion crash particles
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 6 + 2;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: Math.random() * 6 + 2,
        color: i % 2 === 0 ? "#ff007f" : "#ffb700",
        alpha: 1,
        life: 0,
        maxLife: 40 + Math.random() * 20
      });
    }

    // Render one last frame for explosion visual
    this.render();

    const breakdown: ScoreBreakdown = {
      obstacleScore: this.obstacleScore,
      quizScore: this.quizScore,
      bonusScore: this.bonusScore,
      zoneBonus: this.zoneBonus,
      totalScore: this.getTotalScore(),
      obstaclesPassed: this.obstaclesPassedCount,
      quizzesAnswered: this.quizzesAnsweredCount,
      quizzesCorrect: this.quizzesCorrectCount,
      maxStreak: this.maxStreak
    };

    setTimeout(() => {
      this.callbacks.onGameOver(breakdown);
    }, 400);
  }

  // --- RENDERING PIPELINE ---

  private render() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear background
    this.ctx.clearRect(0, 0, width, height);

    // 1. Render Parallax Tech Background
    this.drawBackground(width, height);

    // 2. Render Obstacles
    for (const obs of this.obstacles) {
      this.drawObstacle(obs);
    }

    // 3. Render Player Drone/Robot
    this.drawPlayer();

    // 4. Render Particles & Floating Text
    this.drawParticles();
  }

  private drawBackground(w: number, h: number) {
    const zoneInfo = ZONES[this.currentZone];

    // Background gradient
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, zoneInfo.bgGradient[0]);
    grad.addColorStop(0.5, zoneInfo.bgGradient[1]);
    grad.addColorStop(1, zoneInfo.bgGradient[2]);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Grid pattern with parallax scroll
    this.ctx.strokeStyle = `${zoneInfo.themeColor}15`;
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    const offsetX = (this.distanceTraveled * 0.4) % gridSize;

    this.ctx.beginPath();
    for (let x = -offsetX; x < w; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
    }
    this.ctx.stroke();

    // Ambient floating tech dots/particles
    this.ctx.fillStyle = `${zoneInfo.themeColor}30`;
    for (let i = 0; i < 15; i++) {
      const dotX = (i * 110 - this.distanceTraveled * 0.2) % w;
      const realX = dotX < 0 ? dotX + w : dotX;
      const dotY = ((i * 73) % (h - 40)) + 20;
      this.ctx.beginPath();
      this.ctx.arc(realX, dotY, (i % 3) + 1, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawObstacle(obs: Obstacle) {
    const theme = ZONES[this.currentZone].themeColor;

    this.ctx.save();

    // Semi-transparent ghost mode after quiz
    if (this.ghostObstaclesRemaining > 0) {
      this.ctx.globalAlpha = 0.45;
    }

    // --- TOP OBSTACLE ---
    this.drawTechBlock(obs.x, 0, obs.width, obs.topHeight, true, theme);

    // --- BOTTOM OBSTACLE ---
    const bottomHeight = this.canvas.height - obs.bottomY;
    this.drawTechBlock(obs.x, obs.bottomY, obs.width, bottomHeight, false, theme);

    // --- ENERGY GAP INDICATOR (Glow edges at the gap) ---
    this.ctx.shadowColor = theme;
    this.ctx.shadowBlur = 12;
    this.ctx.fillStyle = theme;
    this.ctx.fillRect(obs.x - 2, obs.topHeight - 6, obs.width + 4, 6);
    this.ctx.fillRect(obs.x - 2, obs.bottomY, obs.width + 4, 6);

    this.ctx.restore();
  }

  private drawTechBlock(x: number, y: number, w: number, h: number, isTop: boolean, color: string) {
    // Dark metallic fill
    this.ctx.fillStyle = "#0c1322";
    this.ctx.fillRect(x, y, w, h);

    // Outer cyber border
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);

    // Inner server/circuit pattern
    this.ctx.fillStyle = `${color}20`;
    const slotH = 16;
    const startY = isTop ? 10 : y + 10;
    const endY = isTop ? y + h - 10 : y + h - 10;

    for (let sy = startY; sy < endY; sy += slotH + 8) {
      if (sy + slotH < y + h) {
        this.ctx.fillRect(x + 8, sy, w - 16, slotH);

        // Blinking indicator lights
        this.ctx.fillStyle = Math.sin(Date.now() / 200 + sy) > 0 ? color : "#ff007f";
        this.ctx.beginPath();
        this.ctx.arc(x + w - 14, sy + slotH / 2, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = `${color}20`;
      }
    }
  }

  private drawPlayer() {
    const { x, y, angle } = this.player;
    const color = this.character.color;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    // Draw active Ghost Shield Aura when post-quiz grace period is active
    if (this.ghostObstaclesRemaining > 0) {
      const shieldPulse = Math.sin(Date.now() / 100) * 4;
      this.ctx.strokeStyle = "#00f0ff";
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = "#00f0ff";
      this.ctx.shadowBlur = 20;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 26 + shieldPulse, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Outer Glow
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 18;

    // Drone Main Body (Futuristic Shield Shape)
    this.ctx.fillStyle = "#0f172a";
    this.ctx.beginPath();
    this.ctx.moveTo(18, 0);
    this.ctx.lineTo(-12, -14);
    this.ctx.lineTo(-18, 0);
    this.ctx.lineTo(-12, 14);
    this.ctx.closePath();
    this.ctx.fill();

    // Body Neon Stroke
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Visor / Eye
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(4, 0, 7, 4, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Secondary Accents (Wings / Thrusters)
    this.ctx.fillStyle = this.character.secondaryColor;
    this.ctx.fillRect(-16, -16, 6, 8);
    this.ctx.fillRect(-16, 8, 6, 8);

    // Thruster Pulse Glow behind drone
    this.ctx.fillStyle = color;
    const pulse = Math.sin(Date.now() / 50) * 3;
    this.ctx.beginPath();
    this.ctx.arc(-20, 0, 4 + pulse, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawParticles() {
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.text) {
        this.ctx.font = `bold ${p.size}px sans-serif`;
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.textAlign = "center";
        this.ctx.fillText(p.text, p.x, p.y);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 6;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  public destroy() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
