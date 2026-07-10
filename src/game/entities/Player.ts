import Phaser from 'phaser';
import { LASER_Y, PLAYER_X } from '../constants';

export class Player {
  private readonly graphic: Phaser.GameObjects.Graphics;
  private cooldownUntil = 0;

  public constructor(private readonly scene: Phaser.Scene) {
    this.graphic = scene.add.graphics();
    this.render(0);
  }

  public setCooldown(now: number, cooldownMs: number): void {
    this.cooldownUntil = now + cooldownMs;
  }

  public render(now: number): void {
    const cooling = now < this.cooldownUntil;
    this.graphic.clear();
    this.graphic.fillStyle(0x090e21, 1);
    this.graphic.lineStyle(2, cooling ? 0xff5b5b : 0x42f8ff, 1);
    this.graphic.fillCircle(PLAYER_X - 14, LASER_Y + 16, 16);
    this.graphic.strokeCircle(PLAYER_X - 14, LASER_Y + 16, 16);
    this.graphic.fillStyle(cooling ? 0xff5b5b : 0x42f8ff, 1);
    this.graphic.fillRect(PLAYER_X - 8, LASER_Y - 8, 40, 16);
    this.graphic.fillTriangle(PLAYER_X + 28, LASER_Y - 10, PLAYER_X + 46, LASER_Y, PLAYER_X + 28, LASER_Y + 10);
  }

  public runForward(): void {
    this.scene.tweens.add({
      targets: this.graphic,
      x: 24,
      duration: 220,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }
}
