import Phaser from 'phaser';
import { LASER_Y, TARGET_X } from '../constants';

export class TargetCore {
  private readonly graphic: Phaser.GameObjects.Graphics;

  public constructor(private readonly scene: Phaser.Scene) {
    this.graphic = scene.add.graphics();
    this.render();
  }

  public render(): void {
    const points = this.createHexPoints(TARGET_X, LASER_Y, 42);
    this.graphic.clear();
    this.graphic.fillStyle(0x091627, 1);
    this.graphic.lineStyle(3, 0x42f8ff, 1);
    this.graphic.fillPoints(points, true);
    this.graphic.strokePoints(points, true);
    this.graphic.lineStyle(2, 0xff4ff6, 0.85);
    this.graphic.strokeCircle(TARGET_X, LASER_Y, 20);
  }

  public hitFlash(): void {
    const flash = this.scene.add.graphics();
    flash.fillStyle(0xffffff, 0.95);
    flash.fillCircle(TARGET_X, LASER_Y, 54);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.6,
      duration: 300,
      onComplete: () => flash.destroy(),
    });
  }

  private createHexPoints(x: number, y: number, radius: number): Phaser.Math.Vector2[] {
    return Array.from({ length: 6 }, (_, index) => {
      const angle = Math.PI / 6 + (Math.PI * 2 * index) / 6;
      return new Phaser.Math.Vector2(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    });
  }
}
