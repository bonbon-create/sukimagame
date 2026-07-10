import Phaser from 'phaser';
import { LASER_Y, PLAYER_X, TARGET_X } from '../constants';
import { Laser } from '../entities/Laser';
import { AudioSystem } from '../systems/AudioSystem';

export class HowToScene extends Phaser.Scene {
  private gateTop!: Phaser.GameObjects.Rectangle;
  private gateBottom!: Phaser.GameObjects.Rectangle;
  private demoText!: Phaser.GameObjects.Text;

  public constructor() {
    super('HowToScene');
  }

  public create(): void {
    this.drawBackground();
    this.add.text(480, 82, '遊び方', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '42px',
      color: '#f7fbff',
    }).setOrigin(0.5);
    this.add.text(480, 136, 'スキマができた瞬間にタップ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px',
      color: '#42f8ff',
    }).setOrigin(0.5);
    this.add.text(480, 178, 'クリック / タップ / Spaceで水平レーザーを発射', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#f7fbff',
    }).setOrigin(0.5);

    this.add.rectangle(PLAYER_X, LASER_Y, 54, 24, 0x42f8ff, 0.95);
    this.add.circle(TARGET_X, LASER_Y, 34, 0x091627, 1).setStrokeStyle(3, 0xff4ff6);
    this.gateTop = this.add.rectangle(500, LASER_Y - 86, 58, 118, 0x1c153d, 1).setStrokeStyle(2, 0xff4ff6);
    this.gateBottom = this.add.rectangle(500, LASER_Y + 86, 58, 118, 0x1c153d, 1).setStrokeStyle(2, 0xff4ff6);
    this.demoText = this.add.text(480, 404, '', {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '24px',
      color: '#42f8ff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.gateTop,
      y: LASER_Y - 150,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.gateBottom,
      y: LASER_Y + 150,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.time.addEvent({
      delay: 1700,
      loop: true,
      callback: () => this.playDemoShot(),
    });

    this.createButton(480, 464, '戻る', () => {
      AudioSystem.shared.play('button');
      this.scene.start('TitleScene');
    });
  }

  private playDemoShot(): void {
    Laser.fire(this, true);
    AudioSystem.shared.play('laser');
    this.demoText.setText('今！');
    this.demoText.setAlpha(1);
    this.tweens.add({
      targets: this.demoText,
      alpha: 0,
      y: 382,
      duration: 520,
      onComplete: () => {
        this.demoText.setY(404);
      },
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const box = this.add.rectangle(x, y, 180, 42, 0x101a32, 1).setStrokeStyle(2, 0x42f8ff);
    const text = this.add.text(x, y, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#f7fbff',
    }).setOrigin(0.5);
    box.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
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
    graphics.lineBetween(PLAYER_X, LASER_Y, TARGET_X, LASER_Y);
  }
}
