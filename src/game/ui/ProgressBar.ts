import Phaser from 'phaser';

export class ProgressBar {
  private readonly graphic: Phaser.GameObjects.Graphics;

  public constructor(private readonly scene: Phaser.Scene, private readonly total: number) {
    this.graphic = scene.add.graphics();
  }

  public render(currentIndex: number): void {
    const cellWidth = 18;
    const gap = 6;
    const startX = 480 - ((cellWidth + gap) * this.total - gap) / 2;

    this.graphic.clear();
    for (let index = 0; index < this.total; index += 1) {
      const x = startX + index * (cellWidth + gap);
      const color = index < currentIndex ? 0x42f8ff : index === currentIndex ? 0xffffff : 0x25304a;
      this.graphic.fillStyle(color, index <= currentIndex ? 1 : 0.65);
      this.graphic.fillRoundedRect(x, 24, cellWidth, 8, 2);
    }
  }
}
