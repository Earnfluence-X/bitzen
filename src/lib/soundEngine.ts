class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not available
    }
  }

  send() {
    this.playTone(880, 0.15, 'sine', 0.1);
    setTimeout(() => this.playTone(660, 0.15, 'sine', 0.08), 100);
    setTimeout(() => this.playTone(440, 0.2, 'sine', 0.06), 200);
  }

  receive() {
    this.playTone(523, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.1), 80);
    setTimeout(() => this.playTone(784, 0.1, 'sine', 0.1), 160);
    setTimeout(() => this.playTone(1047, 0.2, 'sine', 0.12), 240);
  }

  bonus() {
    this.playTone(523, 0.12, 'sine', 0.1);
    setTimeout(() => this.playTone(659, 0.12, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(784, 0.12, 'sine', 0.1), 200);
    setTimeout(() => this.playTone(1047, 0.3, 'sine', 0.15), 300);
  }

  click() {
    this.playTone(1200, 0.05, 'sine', 0.05);
  }

  error() {
    this.playTone(200, 0.15, 'square', 0.08);
    setTimeout(() => this.playTone(150, 0.2, 'square', 0.06), 150);
  }

  toast() {
    this.playTone(800, 0.08, 'sine', 0.06);
  }
}

export const soundEngine = new SoundEngine();
