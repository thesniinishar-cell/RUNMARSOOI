/**
 * Marsupilami Jungle Runner - Particle System
 * Manages dust puffs, water/mud splashes, blue sparkles, feathers, and speed lines.
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.speedLines = [];
  }

  reset() {
    this.particles = [];
    this.speedLines = [];
  }

  // Dust puff when Marsupilami runs on ground or lands
  spawnDust(x, y) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + (Math.random() * 20 - 10),
        y: y + (Math.random() * 6 - 3),
        vx: -(Math.random() * 2 + 1),
        vy: -(Math.random() * 1.5 + 0.5),
        radius: Math.random() * 5 + 3,
        color: 'rgba(215, 180, 130, ',
        alpha: 0.7,
        decay: 0.04,
        type: 'dust'
      });
    }
  }

  // Glowing blue sparkle burst on eating Blue Fish
  spawnBlueSparkles(x, y) {
    const colors = ['#00e5ff', '#80d8ff', '#ffffff', '#29b6f6'];
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.03,
        type: 'sparkle'
      });
    }
  }

  // Mud / sludge splash on eating Black Fish
  spawnMudSplash(x, y) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // upward burst
      const speed = Math.random() * 5 + 1.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 6 + 3,
        color: '#4e342e',
        alpha: 0.9,
        decay: 0.035,
        type: 'mud'
      });
    }
  }

  // White/grey feathers and sparks on crash
  spawnFeatherBurst(x, y) {
    const colors = ['#ffffff', '#cfd8dc', '#90a4ae', '#ff5252'];
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.02,
        type: 'feather'
      });
    }
  }

  // Speed lines when Marsupilami travels fast (speed > 25 km/h)
  updateSpeedLines(canvasWidth, canvasHeight, speedRatio) {
    if (speedRatio > 0.4 && Math.random() < speedRatio * 0.7) {
      this.speedLines.push({
        x: canvasWidth + 20,
        y: Math.random() * canvasHeight,
        length: Math.random() * 80 + 40,
        speed: (Math.random() * 15 + 20) * speedRatio,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    for (let i = this.speedLines.length - 1; i >= 0; i--) {
      const line = this.speedLines[i];
      line.x -= line.speed;
      if (line.x + line.length < 0) {
        this.speedLines.splice(i, 1);
      }
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Gravity for mud and dust
      if (p.type === 'mud' || p.type === 'dust') {
        p.vy += 0.15;
      }

      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Draw speed lines first
    ctx.save();
    for (const line of this.speedLines) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${line.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineTo(line.x + line.length, line.y);
      ctx.stroke();
    }
    ctx.restore();

    // Draw active particles
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color.includes('rgba') ? `${p.color}${p.alpha})` : p.color;

      ctx.beginPath();
      if (p.type === 'feather') {
        // Oval feather shape
        ctx.ellipse(p.x, p.y, p.radius * 1.6, p.radius * 0.8, p.vx * 0.2, 0, Math.PI * 2);
      } else {
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.restore();
  }
}
