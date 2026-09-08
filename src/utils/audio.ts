// Web Audio API procedural sound engine for pure Brainrot sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private phonkInterval: number | null = null;
  public isPhonkPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Iconic Vine Boom sub-bass drop with distortion
  vineBoom() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.linearRampToValueAtTime(60, now + 0.9);

      gain.gain.setValueAtTime(1.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // safe fallback
    }
  }

  // Falling metal pipe sound
  metalPipe() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const freqs = [587, 880, 1174, 1760, 2349, 3135];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.6);

        gain.gain.setValueAtTime(0.15 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7 + idx * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.8 + idx * 0.1);
      });
    } catch {
      // safe fallback
    }
  }

  // Classic Airhorn Tu-Tu-Tu-Tuuu
  airhorn() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [
        { start: 0.0, dur: 0.12, freq: 466.16 }, // Bb4
        { start: 0.15, dur: 0.12, freq: 466.16 },
        { start: 0.30, dur: 0.12, freq: 466.16 },
        { start: 0.45, dur: 0.55, freq: 466.16 },
      ];

      const baseTime = ctx.currentTime;

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.freq, baseTime + n.start);

        // Slight pitch bend
        osc.frequency.exponentialRampToValueAtTime(n.freq * 1.05, baseTime + n.start + n.dur);

        gain.gain.setValueAtTime(0.25, baseTime + n.start);
        gain.gain.exponentialRampToValueAtTime(0.001, baseTime + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(baseTime + n.start);
        osc.stop(baseTime + n.start + n.dur);
      });
    } catch {
      // safe fallback
    }
  }

  // Fart sound
  fart() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.4);

      // LFO for flutter
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(25, now);
      lfoGain.gain.setValueAtTime(30, now);
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 0.5);
      osc.stop(now + 0.5);
    } catch {
      // safe fallback
    }
  }

  // Slap / Pop
  slap() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // safe fallback
    }
  }

  // Cash Register Cha-Ching
  chaChing() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      [1318.5, 1760, 2093].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch {
      // safe fallback
    }
  }

  // Level up cheer
  levelUp() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.09);

        gain.gain.setValueAtTime(0.25, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.3);
      });
    } catch {
      // safe fallback
    }
  }

  // Bruh synth voice
  bruh() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.35);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.linearRampToValueAtTime(320, now + 0.35);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // safe fallback
    }
  }

  // Procedural Phonk Loop generator
  togglePhonk(start?: boolean) {
    try {
      const ctx = this.getContext();
      if (!ctx) return false;

      if (this.phonkInterval !== null || start === false) {
        if (this.phonkInterval) clearInterval(this.phonkInterval);
        this.phonkInterval = null;
        this.isPhonkPlaying = false;
        return false;
      }

      this.isPhonkPlaying = true;
      let step = 0;
      const cowbellScale = [587, 659, 698, 783, 880, 1046];

      this.phonkInterval = window.setInterval(() => {
        try {
          const now = ctx.currentTime;

          // 808 Bass Kick on 0, 2, 4, 6
          if (step % 2 === 0) {
            const bassOsc = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bassOsc.type = 'sine';
            bassOsc.frequency.setValueAtTime(120, now);
            bassOsc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

            bassGain.gain.setValueAtTime(0.5, now);
            bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

            bassOsc.connect(bassGain);
            bassGain.connect(ctx.destination);
            bassOsc.start(now);
            bassOsc.stop(now + 0.3);
          }

          // Cowbell melody
          const freq = cowbellScale[(step * 3) % cowbellScale.length];
          const bellOsc = ctx.createOscillator();
          const bellGain = ctx.createGain();
          bellOsc.type = 'triangle';
          bellOsc.frequency.setValueAtTime(freq, now);

          bellGain.gain.setValueAtTime(0.12, now);
          bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          bellOsc.connect(bellGain);
          bellGain.connect(ctx.destination);
          bellOsc.start(now);
          bellOsc.stop(now + 0.18);

          step = (step + 1) % 16;
        } catch {
          // ignore loop glitch
        }
      }, 170);

      return true;
    } catch {
      return false;
    }
  }
}

export const sounds = new SoundEngine();
