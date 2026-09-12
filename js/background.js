/**
 * Marsupilami Jungle Runner - Parallax Background using authentic Sprite Artwork
 * Renders the panoramic jungle background (jungle_background.png), hanging vines (vine.png),
 * and atmospheric glowing fireflies.
 */

class ParallaxBackground {
  constructor(canvasWidth, canvasHeight) {
    this.w = canvasWidth;
    this.h = canvasHeight;

    // Load authentic sprite images
    this.bgImg = new Image();
    this.bgImg.src = 'assets/sprites/jungle_background.png?v=5';
    this.bgLoaded = false;
    this.bgImg.onload = () => { this.bgLoaded = true; };

    // Scroll offsets
    this.bgOffset = 0;

    // Ambient floating fireflies
    this.fireflies = [];
    for (let i = 0; i < 20; i++) {
      this.fireflies.push({
        x: Math.random() * this.w,
        y: Math.random() * (this.h - 80) + 30,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random(),
        speedX: -(Math.random() * 0.3 + 0.1),
        speedY: (Math.random() - 0.5) * 0.25,
        pulseSpeed: Math.random() * 0.04 + 0.02
      });
    }
  }

  update(gameSpeed) {
    const baseScroll = gameSpeed * 0.45;
    this.bgOffset += baseScroll;

    // Update ambient fireflies
    for (const fly of this.fireflies) {
      fly.x += fly.speedX - baseScroll * 0.2;
      fly.y += fly.speedY;
      fly.alpha += Math.sin(Date.now() * 0.003 + fly.pulseSpeed) * 0.02;

      if (fly.x < -10) fly.x = this.w + 10;
      if (fly.y < 30) fly.y = this.h - 100;
      if (fly.y > this.h - 70) fly.y = 50;
    }
  }

  draw(ctx) {
    // 1. Draw Panoramic Jungle Background
    if (this.bgLoaded && this.bgImg.naturalWidth > 0) {
      const scale = this.h / this.bgImg.naturalHeight;
      const scaledW = Math.ceil(this.bgImg.naturalWidth * scale);
      const startX = -(this.bgOffset % scaledW);

      for (let x = startX; x < this.w; x += scaledW - 1) {
        ctx.drawImage(this.bgImg, x, 0, scaledW, this.h);
      }
    } else {
      // Fallback deep jungle gradient while image loads
      const skyGrad = ctx.createLinearGradient(0, 0, 0, this.h);
      skyGrad.addColorStop(0, '#1b5e20');
      skyGrad.addColorStop(0.7, '#2e7d32');
      skyGrad.addColorStop(1, '#1b120c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    // 2. Draw Ambient Fireflies
    ctx.save();
    for (const fly of this.fireflies) {
      ctx.globalAlpha = Math.max(0.2, Math.min(0.9, fly.alpha));
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(fly.x, fly.y, fly.size, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow aura
      ctx.fillStyle = 'rgba(255, 235, 59, 0.25)';
      ctx.beginPath();
      ctx.arc(fly.x, fly.y, fly.size * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
