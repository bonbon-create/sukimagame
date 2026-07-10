import Phaser from 'phaser';
import { UI_COLORS } from './theme';

export class ProgressBar {
  private readonly graphic: Phaser.GameObjects.Graphics;

  public constructor(private readonly scene: Phaser.Scene, private readonly total: number) {
    this.graphic = scene.add.graphics();
  }

  public render(currentIndex: number): void {
    const cellWidth = 17;
    const gap = 5;
    const startX = 480 - ((cellWidth + gap) * this.total - gap) / 2;

    this.graphic.clear();
    this.graphic.fillStyle(0x02040b, 0.56);
    this.graphic.fillRoundedRect(startX - 12, 16, (cellWidth + gap) * this.total - gap + 24, 24, 6);
    this.graphic.lineStyle(1, UI_COLORS.cyan, 0.42);
    this.graphic.strokeRoundedRect(startX - 12, 16, (cellWidth + gap) * this.total - gap + 24, 24, 6);
    for (let index = 0; index < this.total; index += 1) {
      const x = startX + index * (cellWidth + gap);
      const color = index < currentIndex ? UI_COLORS.cyan : index === currentIndex ? UI_COLORS.white : UI_COLORS.muted;
      this.graphic.fillStyle(color, index <= currentIndex ? 1 : 0.65);
      this.graphic.fillRoundedRect(x, 24, cellWidth, 8, 2);
      if (index === currentIndex) {
        this.graphic.lineStyle(1, UI_COLORS.magenta, 0.9);
        this.graphic.strokeRoundedRect(x - 2, 22, cellWidth + 4, 12, 3);
      }
    }
  }
}
