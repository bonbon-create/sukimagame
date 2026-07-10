import Phaser from 'phaser';

export class HowToScene extends Phaser.Scene {
  public constructor() {
    super('HowToScene');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#050712');
    this.add.text(480, 160, 'スキマができた瞬間にタップ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '34px',
      color: '#f7fbff',
    }).setOrigin(0.5);
    this.add.text(480, 230, 'クリック / タップ / Spaceで水平レーザーを発射', {
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
