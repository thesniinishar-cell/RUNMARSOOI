/**
 * Marsupilami Jungle Runner - Audio Synthesizer (Web Audio API)
 * Generates dynamic sound effects and ambient jungle rhythm without external audio dependencies.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.musicTimer = null;
    this.musicPlaying = false;
    this.stepCounter = 0;
  }

  // Initialize and unlock audio on first player gesture
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isMuted;
  }

  // Marsupilami jump / swing sound (Springy upward whistle)
  playJump() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.18);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Drop back to ground (gentle swoosh / thud)
  playDrop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Blue Fish collected: High cheerful magical powerup chime
  playBlueFish() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    freqs.forEach((f, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + index * 0.04);

      gain.gain.setValueAtTime(0.2, now + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.04 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.04);
      osc.stop(now + index * 0.04 + 0.2);
    });
  }

  // Black Fish collected: Muddy low squelch / slow-down sound
  playBlackFish() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Winged Fish warning alert
  playWingWarning() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(660, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Lethal collision / Game Over: Cartoon bonk & descending slide
  playGameOver() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Bonk impact
    const oscBonk = this.ctx.createOscillator();
    const gainBonk = this.ctx.createGain();
    oscBonk.type = 'square';
    oscBonk.frequency.setValueAtTime(140, now);
    oscBonk.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    gainBonk.gain.setValueAtTime(0.45, now);
    gainBonk.gain.linearRampToValueAtTime(0.01, now + 0.25);

    oscBonk.connect(gainBonk);
    gainBonk.connect(this.ctx.destination);
    oscBonk.start(now);
    oscBonk.stop(now + 0.28);

    // Houba defeat slide
    const oscSlide = this.ctx.createOscillator();
    const gainSlide = this.ctx.createGain();
    oscSlide.type = 'sawtooth';
    oscSlide.frequency.setValueAtTime(480, now + 0.15);
    oscSlide.frequency.exponentialRampToValueAtTime(90, now + 0.7);
    gainSlide.gain.setValueAtTime(0.3, now + 0.15);
    gainSlide.gain.linearRampToValueAtTime(0.01, now + 0.75);

    oscSlide.connect(gainSlide);
    gainSlide.connect(this.ctx.destination);
    oscSlide.start(now + 0.15);
    oscSlide.stop(now + 0.8);
  }

  // Rhythmic Jungle Bongo / Marimba Loop
  startMusic() {
    if (this.isMuted || this.musicPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.musicPlaying = true;
    this.stepCounter = 0;

    const tempo = 220; // ms per 16th note
    const pattern = [
      { pitch: 130, dur: 0.08, vol: 0.12 }, // Low bongo
      null,
      { pitch: 260, dur: 0.05, vol: 0.08 }, // Mid woodblock
      null,
      { pitch: 190, dur: 0.06, vol: 0.10 }, // High bongo
      null,
      { pitch: 260, dur: 0.05, vol: 0.08 },
      { pitch: 340, dur: 0.05, vol: 0.07 }
    ];

    this.musicTimer = setInterval(() => {
      if (this.isMuted || !this.musicPlaying) return;
      const hit = pattern[this.stepCounter % pattern.length];
      this.stepCounter++;

      if (hit && this.ctx) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(hit.pitch, now);
        osc.frequency.exponentialRampToValueAtTime(hit.pitch * 0.5, now + hit.dur);

        gain.gain.setValueAtTime(hit.vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + hit.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + hit.dur + 0.02);
      }
    }, tempo);
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

// Global sound singleton
const soundEngine = new SoundEngine();
