import Phaser from 'phaser';

export class RecordsScene extends Phaser.Scene {
  public constructor() {
    super('RecordsScene');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#050712');
    this.add.text(480, 170, '記録', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '42px',
      color: '#f7fbff',
    }).setOrigin(0.5);
    this.add.text(480, 250, 'ランキングは第3段階で実装します', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      color: '#42f8ff',
    }).setOrigin(0.5);
    this.add.text(480, 350, '戻る', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '26px',
      color: '#ff85f7',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('TitleScene'));
  }
}
