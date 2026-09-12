/**
 * Marsupilami Jungle Runner - Obstacles & Fish System using authentic Sprite Artwork
 * 1. Blue Fish (blue_fish.png): Speed boost (+3.5 km/h) & +100 Score
 * 2. Black Fish (black_fish.png): Slow down (-2.5 km/h) & -25 Score
 * 3. Winged Fish (winged_fish.png): Lethal hazard! (Game Over)
 *    - Bottom Lane: Marsupilami must swing on the Top Vine.
 *    - Top Lane: Marsupilami must run on the Bottom Ground.
 */

// Global preloaded sprite images for fish
const fishSprites = {
  blue: new Image(),
  black: new Image(),
  winged: new Image()
};
fishSprites.blue.src = 'assets/sprites/blue_fish.png?v=5';
fishSprites.black.src = 'assets/sprites/black_fish.png?v=5';
fishSprites.winged.src = 'assets/sprites/winged_fish.png?v=5';

// ==========================================
// 1. BLUE FISH (SPEED BOOST & SCORE)
// ==========================================
class BlueFish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 24;
    this.type = 'blue';
    this.swimPhase = Math.random() * Math.PI * 2;
    this.collected = false;

    this.w = 72;
    this.h = 62;
  }

  update(gameSpeed) {
    this.x -= gameSpeed * 0.45;
    this.swimPhase += 0.14;
  }

  draw(ctx) {
    const bob = Math.sin(this.swimPhase) * 6;
    const currentY = this.y + bob;

    ctx.save();
    ctx.translate(this.x, currentY);

    // Glowing cyan/blue aura
    const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 34);
    aura.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
    aura.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();

    // Face left towards Marsupilami
    ctx.scale(-1, 1);

    // Draw authentic blue_fish.png
    if (fishSprites.blue.naturalWidth > 0) {
      ctx.drawImage(fishSprites.blue, -this.w * 0.5, -this.h * 0.5, this.w, this.h);
    }

    ctx.restore();
  }

  isOffScreen() {
    return this.x < -70;
  }
}

// ==========================================
// 2. BLACK FISH (SLOW DOWN & PENALTY)
// ==========================================
class BlackFish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 24;
    this.type = 'black';
    this.swimPhase = Math.random() * Math.PI * 2;
    this.collected = false;

    this.w = 72;
    this.h = 65;
  }

  update(gameSpeed) {
    this.x -= gameSpeed * 0.45;
    this.swimPhase += 0.12;
  }

  draw(ctx) {
    const bob = Math.sin(this.swimPhase) * 5;
    const currentY = this.y + bob;

    ctx.save();
    ctx.translate(this.x, currentY);

    // Dark sludge aura
    const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 32);
    aura.addColorStop(0, 'rgba(40, 15, 15, 0.45)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();

    // Face left towards Marsupilami
    ctx.scale(-1, 1);

    // Draw authentic black_fish.png
    if (fishSprites.black.naturalWidth > 0) {
      ctx.drawImage(fishSprites.black, -this.w * 0.5, -this.h * 0.5, this.w, this.h);
    }

    ctx.restore();
  }

  isOffScreen() {
    return this.x < -70;
  }
}

// ==========================================
// 3. WINGED FISH (LETHAL HAZARD - GREY & WHITE)
// ==========================================
class WingedFish {
  constructor(x, lane, groundY, vineY) {
    this.x = x;
    this.lane = lane; // 'TOP' or 'BOTTOM'
    this.groundY = groundY; // ~405
    this.vineY = vineY;     // ~145
    this.y = (lane === 'TOP') ? vineY : groundY;
    this.radius = 30;
    this.type = 'winged';

    this.wingCycle = 0;
    this.glideWave = Math.random() * Math.PI * 2;

    this.w = 98;
    this.h = 80;
  }

  update(gameSpeed) {
    // Flies forward smoothly
    this.x -= gameSpeed * 0.58;
    this.wingCycle += 0.25;
    this.glideWave += 0.08;
  }

  draw(ctx) {
    const bob = Math.sin(this.glideWave) * 8;
    const currentY = this.y + bob;

    ctx.save();
    ctx.translate(this.x, currentY);

    // Warning Red Glow
    const glow = ctx.createRadialGradient(0, 0, 12, 0, 0, 48);
    glow.addColorStop(0, 'rgba(255, 71, 87, 0.4)');
    glow.addColorStop(1, 'rgba(255, 71, 87, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // Face left towards Marsupilami
    ctx.scale(-1, 1);

    // Animated flapping scale
    const flap = Math.sin(this.wingCycle) * 0.12;
    ctx.scale(1, 1 + flap);

    // Draw authentic winged_fish.png
    if (fishSprites.winged.naturalWidth > 0) {
      ctx.drawImage(fishSprites.winged, -this.w * 0.5, -this.h * 0.5, this.w, this.h);
    }

    ctx.restore();
  }

  isOffScreen() {
    return this.x < -80;
  }
}

// ==========================================
// 4. OBSTACLE & FISH SPAWN MANAGER
// ==========================================
class ObstacleManager {
  constructor(canvasWidth, canvasHeight, groundY, vineY) {
    this.w = canvasWidth;
    this.h = canvasHeight;
    this.groundY = groundY;
    this.vineY = vineY;

    this.items = []; // Stores BlueFish, BlackFish, WingedFish
    this.spawnTimer = 0;
    this.lastWingedLane = null;
    this.incomingWarning = null;
  }

  reset() {
    this.items = [];
    this.spawnTimer = 0;
    this.lastWingedLane = null;
    this.incomingWarning = null;
  }

  update(gameSpeed, distanceMeters) {
    this.spawnTimer++;

    // Dynamic spawn interval based on speed and distance
    const interval = Math.max(65, 120 - Math.floor(distanceMeters / 150));

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      this.spawnWave(distanceMeters);
    }

    // Update incoming warning indicator
    if (this.incomingWarning) {
      this.incomingWarning.timer--;
      if (this.incomingWarning.timer <= 0) {
        this.incomingWarning = null;
      }
    }

    // Update items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.update(gameSpeed);
      if (item.isOffScreen() || item.collected) {
        this.items.splice(i, 1);
      }
    }
  }

  spawnWave(distanceMeters) {
    const rand = Math.random();

    // 45% chance for Winged Fish (Lethal hazard), 35% Blue Fish (Speed + Score), 20% Black Fish (Speed -)
    if (rand < 0.45) {
      const lane = (this.lastWingedLane === 'TOP') 
        ? (Math.random() < 0.65 ? 'BOTTOM' : 'TOP')
        : (Math.random() < 0.65 ? 'TOP' : 'BOTTOM');
      
      this.lastWingedLane = lane;

      this.incomingWarning = {
        lane: lane,
        timer: 45
      };
      soundEngine.playWingWarning();

      this.items.push(new WingedFish(this.w + 60, lane, this.groundY, this.vineY));

      // If winged fish flies TOP, Marsupilami stays on ground; occasionally spawn a bonus blue fish on ground
      if (lane === 'TOP' && Math.random() < 0.5) {
        this.items.push(new BlueFish(this.w + 160, this.groundY));
      }
    } else if (rand < 0.75) {
      // Spawn Blue Fish on the ground
      this.items.push(new BlueFish(this.w + 40, this.groundY));

      if (Math.random() < 0.4) {
        this.items.push(new BlueFish(this.w + 110, this.groundY));
      }
    } else {
      // Spawn Black Fish on the ground
      this.items.push(new BlackFish(this.w + 40, this.groundY));
    }
  }

  draw(ctx) {
    for (const item of this.items) {
      item.draw(ctx);
    }

    if (this.incomingWarning) {
      this.drawWarning(ctx, this.incomingWarning.lane);
    }
  }

  drawWarning(ctx, lane) {
    const targetY = (lane === 'TOP') ? this.vineY : this.groundY;
    const pulse = Math.sin(Date.now() * 0.02) * 4;

    ctx.save();
    ctx.translate(this.w - 45 + pulse, targetY);

    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-12, -14);
    ctx.lineTo(-12, 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', -4, 0);

    ctx.fillStyle = '#ffebee';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.textAlign = 'right';
    const hintText = (lane === 'TOP') ? 'DODGE DOWN!' : 'SWING UP!';
    ctx.fillText(hintText, -20, 0);

    ctx.restore();
  }

  checkCollisions(player, particleSystem) {
    const playerHitbox = player.getHitbox();

    for (const item of this.items) {
      if (item.collected) continue;

      const dx = playerHitbox.x - item.x;
      const dy = playerHitbox.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < playerHitbox.radius + item.radius) {
        if (item.type === 'blue') {
          item.collected = true;
          particleSystem.spawnBlueSparkles(item.x, item.y);
          soundEngine.playBlueFish();
          return { type: 'BLUE_FISH' };
        } else if (item.type === 'black') {
          item.collected = true;
          particleSystem.spawnMudSplash(item.x, item.y);
          soundEngine.playBlackFish();
          return { type: 'BLACK_FISH' };
        } else if (item.type === 'winged') {
          particleSystem.spawnFeatherBurst(item.x, item.y);
          soundEngine.playGameOver();
          return { type: 'GAME_OVER' };
        }
      }
    }
    return null;
  }
}
