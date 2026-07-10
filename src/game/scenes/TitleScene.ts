import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    this.drawBackground();
    this.add
      .text(480, 138, '瞬間突破', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '58px',
        color: '#f6fbff',
      })
      .setOrigin(0.5);
    this.add
      .text(480, 196, 'NEON GAP', {
        fontFamily: 'Arial Black, system-ui, sans-serif',
        fontSize: '42px',
        color: '#42f8ff',
      })
      .setOrigin(0.5);
    this.add.text(480, 238, '一瞬のスキマを撃ち抜け', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#ff85f7',
    }).setOrigin(0.5);

    this.createButton(480, 318, 'ゲームスタート', () => this.scene.start('GameScene'));
    this.createButton(480, 378, '遊び方', () => this.scene.start('HowToScene'));
    this.createButton(480, 438, '記録', () => this.scene.start('RecordsScene'));
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const box = this.add.rectangle(x, y, 270, 42, 0x101a32, 0.95).setStrokeStyle(2, 0x42f8ff);
    const text = this.add.text(x, y, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      color: '#f7fbff',
    }).setOrigin(0.5);

    box.setInteractive({ useHandCursor: true });
    box.on('pointerdown', onClick);
    text.setInteractive({ useHandCursor: true });
    text.on('pointerdown', onClick);
  }

  private drawBackground(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x050712, 1);
    graphics.fillRect(0, 0, 960, 540);
    graphics.lineStyle(1, 0x172642, 0.5);
    for (let x = -40; x < 1040; x += 48) {
      for (let y = -40; y < 620; y += 42) {
        graphics.strokeCircle(x + ((y / 42) % 2) * 24, y, 18);
      }
    }
    graphics.lineStyle(2, 0x42f8ff, 0.35);
    graphics.lineBetween(90, 270, 850, 270);
  }
}
