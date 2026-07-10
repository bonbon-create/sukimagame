export class TimerSystem {
  private remainingSeconds: number;

  public constructor(startSeconds: number) {
    this.remainingSeconds = startSeconds;
  }

  public tick(deltaMs: number, paused = false): number {
    if (!paused) {
      this.remainingSeconds = Math.max(0, this.remainingSeconds - deltaMs / 1000);
    }
    return this.remainingSeconds;
  }

  public add(seconds: number): number {
    this.remainingSeconds += seconds;
    return this.remainingSeconds;
  }

  public get remaining(): number {
    return this.remainingSeconds;
  }

  public get expired(): boolean {
    return this.remainingSeconds <= 0;
  }
}
