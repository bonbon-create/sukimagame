import { StorageSystem } from './StorageSystem';

export type SoundKey =
  | 'laser'
  | 'blocked'
  | 'targetHit'
  | 'oneShot'
  | 'stageTransition'
  | 'warningAlarm'
  | 'explosion'
  | 'button';

export class AudioSystem {
  private static instance: AudioSystem | null = null;
  private context: AudioContext | null = null;
  private enabled = StorageSystem.loadAudioEnabled();

  public static get shared(): AudioSystem {
    AudioSystem.instance ??= new AudioSystem();
    return AudioSystem.instance;
  }

  public get isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    StorageSystem.saveAudioEnabled(enabled);
  }

  public play(key: SoundKey): void {
    if (!this.enabled) {
      return;
    }

    const context = this.getContext();
    if (!context) {
      return;
    }

    void context.resume();

    switch (key) {
      case 'laser':
        this.tone(context, 620, 0.05, 'sawtooth', 0.05);
        this.tone(context, 1240, 0.04, 'square', 0.025, 0.02);
        break;
      case 'blocked':
        this.tone(context, 120, 0.12, 'square', 0.08);
        break;
      case 'targetHit':
        this.tone(context, 440, 0.08, 'triangle', 0.08);
        this.tone(context, 880, 0.12, 'sine', 0.05, 0.04);
        break;
      case 'oneShot':
        this.tone(context, 740, 0.08, 'sine', 0.06);
        this.tone(context, 1110, 0.1, 'sine', 0.05, 0.07);
        break;
      case 'stageTransition':
        this.tone(context, 330, 0.05, 'triangle', 0.04);
        this.tone(context, 520, 0.07, 'triangle', 0.04, 0.04);
        break;
      case 'warningAlarm':
        this.tone(context, 220, 0.14, 'sawtooth', 0.075);
        this.tone(context, 180, 0.12, 'sawtooth', 0.06, 0.16);
        break;
      case 'explosion':
        this.noise(context, 0.45, 0.16);
        this.tone(context, 70, 0.35, 'sawtooth', 0.12);
        break;
      case 'button':
        this.tone(context, 520, 0.045, 'triangle', 0.035);
        break;
    }
  }

  private getContext(): AudioContext | null {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    this.context ??= new AudioContextClass();
    return this.context;
  }

  private tone(
    context: AudioContext,
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay = 0,
  ): void {
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency * 0.72), start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private noise(context: AudioContext, duration: number, volume: number): void {
    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }

    const source = context.createBufferSource();
    const gain = context.createGain();
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    source.buffer = buffer;
    source.connect(gain).connect(context.destination);
    source.start();
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
