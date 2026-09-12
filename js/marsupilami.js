/**
 * Marsupilami Character Class using authentic uploaded Sprite Artwork
 * - Run State: uses marsupilami_run.png (2nd uploaded image with background removed)
 * - Jump / Swing State: uses marsupilami_jump.png (1st uploaded image with background removed)
 */

class Marsupilami {
  constructor(x, groundY, vineY) {
    this.x = x;
    this.groundY = groundY; // ~405
    this.vineY = vineY;     // ~145
    this.y = groundY;
    this.targetY = groundY;
    this.vy = 0;

    this.isSwinging = false; // true = jump/vine lane, false = ground run

    // 1. Run Sprite (2nd uploaded image)
    this.runSprite = new Image();
    this.runSprite.src = 'assets/sprites/marsupilami_run.png?v=9';
    this.runLoaded = false;
    this.runSprite.onload = () => { this.runLoaded = true; };

    // 2. Jump Sprite (1st uploaded image)
    this.jumpSprite = new Image();
    this.jumpSprite.src = 'assets/sprites/marsupilami_jump.png?v=9';
    this.jumpLoaded = false;
    this.jumpSprite.onload = () => { this.jumpLoaded = true; };

    // Render dimensions
    this.runWidth = 148;
    this.runHeight = 199;

    this.jumpWidth = 138;
    this.jumpHeight = 202;

    // Animation & sway cycles
    this.runCycle = 0;
    this.swingAngle = 0;

    // Hitbox radius
    this.hitRadius = 34;
  }

  reset() {
    this.y = this.groundY;
    this.targetY = this.groundY;
    this.vy = 0;
    this.isSwinging = false;
    this.runCycle = 0;
    this.swingAngle = 0;
  }

  switchToVine() {
    if (!this.isSwinging) {
      this.isSwinging = true;
      this.targetY = this.vineY;
      soundEngine.playJump();
    }
  }

  switchToGround() {
    if (this.isSwinging) {
      this.isSwinging = false;
      this.targetY = this.groundY;
      soundEngine.playDrop();
    }
  }

  toggleLane() {
    if (this.isSwinging) {
      this.switchToGround();
    } else {
      this.switchToVine();
    }
  }

  update(delta, gameSpeed, particleSystem) {
    // Smooth vertical ease towards target lane
    const dy = this.targetY - this.y;
    this.vy = dy * 0.18;
    this.y += this.vy;

    // Run cycle frequency proportional to speed
    const speedRatio = gameSpeed / 20;
    this.runCycle += 0.28 * speedRatio;

    if (this.isSwinging) {
      // Natural sway while hanging from tail
      this.swingAngle = Math.sin(Date.now() * 0.006) * 0.12;
    } else {
      this.swingAngle = 0;
      // Running dust puffs on ground
      if (Math.abs(this.y - this.groundY) < 12 && Math.random() < 0.35) {
        particleSystem.spawnDust(this.x - 20, this.groundY + 15);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.isSwinging) {
      // 1. JUMP / SWING STATE: Authentic 1st uploaded image
      ctx.rotate(this.swingAngle);

      if (this.jumpLoaded && this.jumpSprite.naturalWidth > 0) {
        // Position so tail top connects to canopy and head/body hangs into lane
        ctx.drawImage(
          this.jumpSprite,
          -this.jumpWidth * 0.5,
          -this.jumpHeight * 0.52,
          this.jumpWidth,
          this.jumpHeight
        );
      }
    } else {
      // 2. RUN STATE: Authentic 2nd uploaded image
      const bob = Math.sin(this.runCycle) * 5;
      const tilt = Math.cos(this.runCycle) * 0.04;
      ctx.translate(0, bob);
      ctx.rotate(tilt);

      if (this.runLoaded && this.runSprite.naturalWidth > 0) {
        // Position so feet run right on ground path
        ctx.drawImage(
          this.runSprite,
          -this.runWidth * 0.5,
          -this.runHeight * 0.72,
          this.runWidth,
          this.runHeight
        );
      }
    }

    ctx.restore();
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y + (this.isSwinging ? 10 : -35),
      radius: this.hitRadius
    };
  }
}
