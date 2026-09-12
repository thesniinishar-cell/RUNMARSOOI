/**
 * Marsupilami Jungle Runner - Main Game Controller & State Machine
 */

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Virtual resolution (16:9 960x540)
    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Y Constants for Lanes
    this.groundY = 405;
    this.vineY = 145;

    // Subsystems
    this.particleSystem = new ParticleSystem();
    this.background = new ParallaxBackground(this.width, this.height);
    this.player = new Marsupilami(180, this.groundY, this.vineY);
    this.obstacleManager = new ObstacleManager(this.width, this.height, this.groundY, this.vineY);

    // Game States
    this.STATE = {
      START: 'START',
      PLAYING: 'PLAYING',
      PAUSED: 'PAUSED',
      GAMEOVER: 'GAMEOVER'
    };
    this.currentState = this.STATE.START;

    // Metrics & Speeds (km/h)
    this.baseSpeed = 20;
    this.minSpeed = 12;
    this.maxSpeed = 44;
    this.currentSpeed = this.baseSpeed;

    this.distanceMeters = 0;
    this.blueFishCount = 0;
    this.blackFishCount = 0;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('marsu_highscore') || '0', 10);

    // Loop & timing
    this.lastTime = 0;
    this.animationFrameId = null;

    // Screen Shake effect
    this.screenShakeActive = false;

    // Cache UI elements
    this.initUI();
    this.initInputs();
  }

  initUI() {
    this.hudDistance = document.getElementById('hudDistance');
    this.hudSpeedVal = document.getElementById('hudSpeedVal');
    this.hudSpeedFill = document.getElementById('hudSpeedFill');
    this.hudScore = document.getElementById('hudScore');
    this.hudBlueFish = document.getElementById('hudBlueFish');
    this.hudBlackFish = document.getElementById('hudBlackFish');
    this.hudLaneBadge = document.getElementById('hudLaneBadge');

    this.startScreen = document.getElementById('startScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.pauseScreen = document.getElementById('pauseScreen');
    this.speedVignette = document.getElementById('speedVignette');

    this.goScore = document.getElementById('goScore');
    this.goDistance = document.getElementById('goDistance');
    this.goBlue = document.getElementById('goBlue');
    this.goBlack = document.getElementById('goBlack');
    this.goHighScore = document.getElementById('goHighScore');

    this.btnStart = document.getElementById('btnStart');
    this.btnRestart = document.getElementById('btnRestart');
    this.btnResume = document.getElementById('btnResume');
    this.btnMute = document.getElementById('btnMute');
    this.btnPause = document.getElementById('btnPause');
    this.btnFullscreen = document.getElementById('btnFullscreen');

    this.btnTouchUp = document.getElementById('btnTouchUp');
    this.btnTouchDown = document.getElementById('btnTouchDown');

    // Button Events
    this.btnStart.addEventListener('click', () => this.startGame());

    const triggerRestart = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.restartGame();
    };

    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', triggerRestart);
      this.btnRestart.addEventListener('touchend', triggerRestart);
    }

    // Also allow clicking anywhere on the lower PLAY AGAIN area of the Game Over card
    const goContainer = document.getElementById('gameOverContainer');
    if (goContainer) {
      goContainer.addEventListener('click', (e) => {
        // Don't trigger if clicked on Home button
        if (e.target.closest('#btnGameOverHome')) return;
        const rect = goContainer.getBoundingClientRect();
        const clickYRatio = (e.clientY - rect.top) / rect.height;
        if (clickYRatio > 0.68) {
          triggerRestart(e);
        }
      });
    }

    this.btnResume.addEventListener('click', () => this.resumeGame());

    if (this.btnFullscreen) {
      this.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    this.btnMute.addEventListener('click', () => {
      const muted = soundEngine.toggleMute();
      this.btnMute.innerHTML = muted ? '🔇' : '🔊';
    });

    this.btnPause.addEventListener('click', () => this.togglePause());

    // Touch controls
    if (this.btnTouchUp) {
      this.btnTouchUp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.player.switchToVine();
      });
      this.btnTouchUp.addEventListener('mousedown', () => this.player.switchToVine());
    }

    if (this.btnTouchDown) {
      this.btnTouchDown.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.player.switchToGround();
      });
      this.btnTouchDown.addEventListener('mousedown', () => this.player.switchToGround());
    }
  }

  initInputs() {
    window.addEventListener('keydown', (e) => {
      // Audio unlock on user interaction
      soundEngine.init();

      if (e.code === 'KeyP') {
        this.togglePause();
        return;
      }

      if (this.currentState === this.STATE.START && (e.code === 'Space' || e.code === 'Enter')) {
        this.startGame();
        return;
      }

      if (this.currentState === this.STATE.GAMEOVER && (e.code === 'Space' || e.code === 'Enter')) {
        this.restartGame();
        return;
      }

      if (this.currentState !== this.STATE.PLAYING) return;

      // Controls for lanes
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        e.preventDefault();
        this.player.switchToVine();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        this.player.switchToGround();
      }
    });

    // Mobile Swipe detection on Canvas
    let touchStartY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      soundEngine.init();
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (this.currentState !== this.STATE.PLAYING) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchEndY - touchStartY;

      if (diffY < -30) {
        // Swipe Up -> Vine
        this.player.switchToVine();
      } else if (diffY > 30) {
        // Swipe Down -> Ground
        this.player.switchToGround();
      } else {
        // Simple tap toggles lane
        this.player.toggleLane();
      }
    });

    // Click on canvas toggles lane during play
    this.canvas.addEventListener('click', () => {
      soundEngine.init();
      if (this.currentState === this.STATE.PLAYING) {
        this.player.toggleLane();
      }
    });
  }

  startGame() {
    soundEngine.init();
    soundEngine.startMusic();
    this.resetAll();
    this.currentState = this.STATE.PLAYING;
    this.lastTime = performance.now();

    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
  }

  restartGame() {
    soundEngine.playJump();
    this.startGame();
  }

  togglePause() {
    if (this.currentState === this.STATE.PLAYING) {
      this.currentState = this.STATE.PAUSED;
      this.pauseScreen.classList.remove('hidden');
      soundEngine.stopMusic();
    } else if (this.currentState === this.STATE.PAUSED) {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.currentState = this.STATE.PLAYING;
    this.pauseScreen.classList.add('hidden');
    soundEngine.startMusic();
    this.lastTime = performance.now();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      if (this.btnFullscreen) this.btnFullscreen.textContent = '🗗';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      if (this.btnFullscreen) this.btnFullscreen.textContent = '⛶';
    }
  }

  resetAll() {
    this.currentSpeed = this.baseSpeed;
    this.distanceMeters = 0;
    this.blueFishCount = 0;
    this.blackFishCount = 0;
    this.score = 0;

    this.player.reset();
    this.obstacleManager.reset();
    this.particleSystem.reset();
    this.updateHUD();
  }

  triggerGameOver() {
    this.currentState = this.STATE.GAMEOVER;
    soundEngine.stopMusic();

    // Trigger Screen Shake
    const wrapper = document.querySelector('.game-wrapper');
    wrapper.classList.remove('screen-shake');
    void wrapper.offsetWidth; // reflow
    wrapper.classList.add('screen-shake');

    // Update High Score & Stats
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('marsu_highscore', this.highScore.toString());
    }

    localStorage.setItem('marsu_last_score', this.score.toString());
    localStorage.setItem('marsu_last_distance', Math.floor(this.distanceMeters).toString());
    localStorage.setItem('marsu_last_blue', this.blueFishCount.toString());
    localStorage.setItem('marsu_last_black', this.blackFishCount.toString());

    // Populate local Game Over Screen if needed
    if (this.goScore) this.goScore.textContent = this.score;
    if (this.goDistance) this.goDistance.textContent = `${Math.floor(this.distanceMeters)} m`;
    if (this.goHighScore) this.goHighScore.textContent = this.highScore;

    // Transition to dedicated full-screen Game Over page (gameover.html)
    setTimeout(() => {
      window.location.href = 'gameover.html';
    }, 450);
  }

  update(delta) {
    if (this.currentState !== this.STATE.PLAYING) {
      // Keep passive background animation on start/gameover
      this.background.update(4);
      this.particleSystem.update(delta);
      return;
    }

    // Distance progression (proportional to current speed)
    this.distanceMeters += (this.currentSpeed * 0.04);

    // Natural subtle speed relaxation back toward base speed
    if (this.currentSpeed > this.baseSpeed) {
      this.currentSpeed = Math.max(this.baseSpeed, this.currentSpeed - 0.015);
    } else if (this.currentSpeed < this.baseSpeed) {
      this.currentSpeed = Math.min(this.baseSpeed, this.currentSpeed + 0.015);
    }

    // Calculate score: distance + fish bonuses
    this.score = Math.floor(this.distanceMeters) + (this.blueFishCount * 100) - (this.blackFishCount * 25);
    if (this.score < 0) this.score = 0;

    // Update subsystems
    this.background.update(this.currentSpeed);
    this.player.update(delta, this.currentSpeed, this.particleSystem);
    this.obstacleManager.update(this.currentSpeed, this.distanceMeters);
    this.particleSystem.update(delta);

    // Speed lines effect when running fast
    const speedRatio = (this.currentSpeed - this.minSpeed) / (this.maxSpeed - this.minSpeed);
    this.particleSystem.updateSpeedLines(this.width, this.height, speedRatio);

    // Speed vignette visual
    if (this.speedVignette) {
      if (this.currentSpeed > 28) {
        this.speedVignette.classList.add('active');
      } else {
        this.speedVignette.classList.remove('active');
      }
    }

    // Check Collisions
    const collision = this.obstacleManager.checkCollisions(this.player, this.particleSystem);
    if (collision) {
      if (collision.type === 'BLUE_FISH') {
        this.blueFishCount++;
        // Speed Boost (+3.5 km/h)
        this.currentSpeed = Math.min(this.maxSpeed, this.currentSpeed + 3.5);
      } else if (collision.type === 'BLACK_FISH') {
        this.blackFishCount++;
        // Speed Slow Down (-2.5 km/h)
        this.currentSpeed = Math.max(this.minSpeed, this.currentSpeed - 2.5);
      } else if (collision.type === 'GAME_OVER') {
        this.triggerGameOver();
        return;
      }
    }

    this.updateHUD();
  }

  updateHUD() {
    this.hudDistance.textContent = `${Math.floor(this.distanceMeters)}m`;
    this.hudSpeedVal.textContent = `${Math.round(this.currentSpeed)}`;

    const speedPct = Math.min(100, Math.max(10, ((this.currentSpeed - this.minSpeed) / (this.maxSpeed - this.minSpeed)) * 100));
    this.hudSpeedFill.style.width = `${speedPct}%`;

    this.hudScore.textContent = this.score;
    this.hudBlueFish.textContent = this.blueFishCount;
    this.hudBlackFish.textContent = this.blackFishCount;

    // Update lane badge
    if (this.hudLaneBadge) {
      if (this.player.isSwinging) {
        this.hudLaneBadge.textContent = '🌿 TOP VINE SWING';
        this.hudLaneBadge.style.borderColor = '#2ecc71';
        this.hudLaneBadge.style.color = '#a7f3d0';
      } else {
        this.hudLaneBadge.textContent = '🐾 BOTTOM GROUND RUN';
        this.hudLaneBadge.style.borderColor = '#f5b041';
        this.hudLaneBadge.style.color = '#fef08a';
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Parallax jungle layers (sky, mountains, canopy, vines, ground)
    this.background.draw(this.ctx);

    // 2. Obstacles & Fish
    this.obstacleManager.draw(this.ctx);

    // 3. Marsupilami Character
    this.player.draw(this.ctx);

    // 4. Particle systems (sparkles, dust, mud, feathers, speed lines)
    this.particleSystem.draw(this.ctx);
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(delta);
    this.draw();

    this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  start() {
    this.updateHUD();
    this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }
}

// Instantiate and start on load
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();

  // Auto-start if navigated from front page
  const params = new URLSearchParams(window.location.search);
  if (params.get('start') === 'true' || params.get('play') === '1') {
    // slight delay to ensure canvas and audio context are ready
    setTimeout(() => {
      game.startGame();
    }, 150);
  }
});

