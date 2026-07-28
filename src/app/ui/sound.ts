export type Cue = "move" | "capture" | "fall" | "win";

export interface AudioEngine {
  currentTime: number;
  destination: AudioNode;
  state: string;
  resume(): Promise<void>;
  createOscillator(): OscillatorNode;
  createGain(): GainNode;
}

interface Tone {
  at?: number;
  from: number;
  to?: number;
  seconds: number;
  wave: OscillatorType;
  gain: number;
}

const CUES: Record<Cue, Tone[]> = {

  move: [
    { from: 660, seconds: 0.06, wave: "triangle", gain: 0.09 }
  ],

  capture: [
    { from: 200, to: 110, seconds: 0.16, wave: "square", gain: 0.09 }
  ],

  fall: [
    { from: 500, to: 70, seconds: 0.55, wave: "sawtooth", gain: 0.1 }
  ],

  win: [
    { at: 0, from: 523, seconds: 0.16, wave: "triangle", gain: 0.09 },
    { at: 0.09, from: 659, seconds: 0.16, wave: "triangle", gain: 0.09 },
    { at: 0.18, from: 784, seconds: 0.16, wave: "triangle", gain: 0.09 },
    { at: 0.27, from: 1046, seconds: 0.3, wave: "triangle", gain: 0.09 }
  ]
};

export default class Sound {

  private engine: AudioEngine | undefined;

  constructor(
    private readonly createEngine: () => AudioEngine,
    private muted = false
  ) {}

  get isMuted(): boolean {

    return this.muted;
  }

  toggle(): boolean {

    this.muted = !this.muted;

    return this.muted;
  }

  play(cue: Cue): void {

    if (this.muted) return;

    const engine = this.engine ??= this.createEngine();

    if (engine.state === "suspended") void engine.resume();

    for (const tone of CUES[cue]) this.sound(engine, tone);
  }

  private sound(
    engine: AudioEngine,
    { at = 0, from, to, seconds, wave, gain }: Tone
  ): void {

    const start = engine.currentTime + at;

    const oscillator = engine.createOscillator();

    const amplifier = engine.createGain();

    oscillator.type = wave;

    oscillator.frequency.setValueAtTime(from, start);

    if (to !== undefined) {

      oscillator.frequency.exponentialRampToValueAtTime(to, start + seconds);
    }

    amplifier.gain.setValueAtTime(0.0001, start);

    amplifier.gain.linearRampToValueAtTime(gain, start + 0.012);

    amplifier.gain.exponentialRampToValueAtTime(0.0001, start + seconds);

    oscillator.connect(amplifier).connect(engine.destination);

    oscillator.start(start);

    oscillator.stop(start + seconds + 0.02);
  }
}
