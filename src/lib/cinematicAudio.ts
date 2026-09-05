/**
 * Procedural Cinematic Sound Design Synthesizer for UNDERGROUNDZZ 4K Brand Intro
 * Powered by Web Audio API — No external audio assets required.
 */

export class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private activeNodes: (AudioNode | OscillatorNode | AudioBufferSourceNode)[] = [];

  constructor() {
    // Lazy initialized on first user interaction to satisfy browser autoplay policies
  }

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Generates low atmospheric wind and sub-frequency drone
   */
  public startAmbientAtmosphere() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Sub-drone oscillator (42Hz - deep rumble)
    const droneOsc = this.ctx.createOscillator();
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(44, now);

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(90, now);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, now);
    droneGain.gain.exponentialRampToValueAtTime(0.18, now + 1.5);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start(now);
    this.activeNodes.push(droneOsc);

    // Wind / mist buffer noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(160, now);
    noiseFilter.Q.setValueAtTime(1.8, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.08, now + 2.0);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    whiteNoise.start(now);
    this.activeNodes.push(whiteNoise);
  }

  /**
   * High-speed brutal motorcycle pass:
   * Aggressive twin-cylinder pitch shift, exhaust spit, turbulent air tear & wet tire whoosh
   */
  public triggerBikePass() {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const now = this.ctx.currentTime;

    // 1. Raw Engine Roar (Twin Sawtooth with frequency modulation & waveshaper)
    const engineOsc1 = this.ctx.createOscillator();
    const engineOsc2 = this.ctx.createOscillator();
    engineOsc1.type = 'sawtooth';
    engineOsc2.type = 'triangle';

    // Approach and Doppler shift
    engineOsc1.frequency.setValueAtTime(70, now);
    engineOsc1.frequency.exponentialRampToValueAtTime(220, now + 1.2); // Acceleration
    engineOsc1.frequency.exponentialRampToValueAtTime(95, now + 2.8);  // Doppler drop as it speeds away

    engineOsc2.frequency.setValueAtTime(72, now);
    engineOsc2.frequency.exponentialRampToValueAtTime(225, now + 1.2);
    engineOsc2.frequency.exponentialRampToValueAtTime(98, now + 2.8);

    const engineFilter = this.ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(320, now);
    engineFilter.frequency.exponentialRampToValueAtTime(2400, now + 1.2);
    engineFilter.frequency.exponentialRampToValueAtTime(450, now + 2.8);

    const engineGain = this.ctx.createGain();
    engineGain.gain.setValueAtTime(0.001, now);
    engineGain.gain.exponentialRampToValueAtTime(0.42, now + 1.15); // Peak at flyby
    engineGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

    // Distortion shaper
    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(18);
    distortion.oversample = '4x';

    engineOsc1.connect(distortion);
    engineOsc2.connect(distortion);
    distortion.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(this.masterGain);

    engineOsc1.start(now);
    engineOsc2.start(now);
    engineOsc1.stop(now + 3.5);
    engineOsc2.stop(now + 3.5);
    this.activeNodes.push(engineOsc1, engineOsc2);

    // 2. Air tearing whoosh / turbulent displacement
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1);
    }

    const whooshSource = this.ctx.createBufferSource();
    whooshSource.buffer = noiseBuffer;

    const whooshFilter = this.ctx.createBiquadFilter();
    whooshFilter.type = 'bandpass';
    whooshFilter.frequency.setValueAtTime(200, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(2800, now + 1.15);
    whooshFilter.frequency.exponentialRampToValueAtTime(180, now + 2.4);
    whooshFilter.Q.setValueAtTime(3.5, now);

    const whooshGain = this.ctx.createGain();
    whooshGain.gain.setValueAtTime(0.001, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.35, now + 1.15);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

    whooshSource.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(this.masterGain);

    whooshSource.start(now);
    whooshSource.stop(now + 2.8);
    this.activeNodes.push(whooshSource);
  }

  /**
   * Shimmering particle vortex & particulate magnetic assembly
   */
  public triggerParticleAssembly() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Harmonic crystalline sweep (rising tension)
    const sweepOsc = this.ctx.createOscillator();
    sweepOsc.type = 'sine';
    sweepOsc.frequency.setValueAtTime(180, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(1450, now + 2.8);

    const sweepGain = this.ctx.createGain();
    sweepGain.gain.setValueAtTime(0.001, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.12, now + 1.8);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    sweepOsc.connect(sweepGain);
    sweepGain.connect(this.masterGain);

    sweepOsc.start(now);
    sweepOsc.stop(now + 3.2);
    this.activeNodes.push(sweepOsc);

    // Particle whisper turbulence
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const pNoise = this.ctx.createBufferSource();
    pNoise.buffer = noiseBuffer;

    const pFilter = this.ctx.createBiquadFilter();
    pFilter.type = 'highpass';
    pFilter.frequency.setValueAtTime(1200, now);
    pFilter.frequency.exponentialRampToValueAtTime(4500, now + 2.5);

    const pGain = this.ctx.createGain();
    pGain.gain.setValueAtTime(0.001, now);
    pGain.gain.exponentialRampToValueAtTime(0.09, now + 2.0);
    pGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    pNoise.connect(pFilter);
    pFilter.connect(pGain);
    pGain.connect(this.masterGain);

    pNoise.start(now);
    pNoise.stop(now + 3.2);
    this.activeNodes.push(pNoise);
  }

  /**
   * Final cinematic impact / 38Hz sub-bass BRAAAM & metallic lock hit
   */
  public triggerTitleLockImpact() {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const now = this.ctx.currentTime;

    // 1. Deep Sub-Bass Drop (68Hz -> 34Hz)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(68, now);
    subOsc.frequency.exponentialRampToValueAtTime(34, now + 0.35);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.85, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(now);
    subOsc.stop(now + 4.0);
    this.activeNodes.push(subOsc);

    // 2. Heavy Industrial Anvil / Metallic Lock Hit
    const metalOsc = this.ctx.createOscillator();
    metalOsc.type = 'triangle';
    metalOsc.frequency.setValueAtTime(220, now);
    metalOsc.frequency.exponentialRampToValueAtTime(85, now + 0.18);

    const metalFilter = this.ctx.createBiquadFilter();
    metalFilter.type = 'bandpass';
    metalFilter.frequency.setValueAtTime(480, now);
    metalFilter.Q.setValueAtTime(4.0, now);

    const metalGain = this.ctx.createGain();
    metalGain.gain.setValueAtTime(0.45, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    metalOsc.connect(metalFilter);
    metalFilter.connect(metalGain);
    metalGain.connect(this.masterGain);

    metalOsc.start(now);
    metalOsc.stop(now + 1.5);
    this.activeNodes.push(metalOsc);

    // 3. Cinematic Bass Reverb Tail
    const bufferSize = this.ctx.sampleRate * 2.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const nData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      nData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.7));
    }

    const tailSource = this.ctx.createBufferSource();
    tailSource.buffer = noiseBuffer;

    const tailFilter = this.ctx.createBiquadFilter();
    tailFilter.type = 'lowpass';
    tailFilter.frequency.setValueAtTime(140, now);

    const tailGain = this.ctx.createGain();
    tailGain.gain.setValueAtTime(0.3, now);
    tailGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    tailSource.connect(tailFilter);
    tailFilter.connect(tailGain);
    tailGain.connect(this.masterGain);

    tailSource.start(now);
    tailSource.stop(now + 3.2);
    this.activeNodes.push(tailSource);
  }

  public fadeOut(duration: number = 0.8) {
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    }
  }

  public stopAll() {
    this.fadeOut(0.2);
    setTimeout(() => {
      this.activeNodes.forEach(node => {
        try {
          if ('stop' in node && typeof (node as AudioBufferSourceNode).stop === 'function') {
            (node as AudioBufferSourceNode).stop();
          }
          node.disconnect();
        } catch {}
      });
      this.activeNodes = [];
    }, 250);
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}
