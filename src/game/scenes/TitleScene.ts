import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';

export class TitleScene extends Phaser.Scene {
  private audioButtonText!: Phaser.GameObjects.Text;

  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    this.drawBackground();
    this.add.text(480, 138, '瞬間突破', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '58px',
      color: '#f6fbff',
    }).setOrigin(0.5);
    this.add.text(480, 196, 'NEON GAP', {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '42px',
      color: '#42f8ff',
    }).setOrigin(0.5);
    this.add.text(480, 238, '一瞬のスキマを撃ち抜け', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#ff85f7',
    }).setOrigin(0.5);

    this.createButton(480, 310, 'ゲームスタート', () => this.startScene('GameScene'));
    this.createButton(480, 366, '遊び方', () => this.startScene('HowToScene'));
    this.createButton(480, 422, '記録', () => this.startScene('RecordsScene'));
    this.createAudioButton();
  }

  private startScene(sceneKey: string): void {
    AudioSystem.shared.play('button');
    this.scene.start(sceneKey);
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const box = this.add.rectangle(x, y, 270, 42, 0x101a32, 0.95).setStrokeStyle(2, 0x42f8ff);
    const text = this.add.text(x, y, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      color: '#f7fbff',
    }).setOrigin(0.5);

    box.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  }

  private createAudioButton(): void {
    const box = this.add.rectangle(824, 44, 142, 34, 0x101a32, 0.9).setStrokeStyle(2, 0xff4ff6);
    this.audioButtonText = this.add.text(824, 44, this.audioLabel(), {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#f7fbff',
    }).setOrigin(0.5);
    const toggle = () => {
      AudioSystem.shared.toggle();
      AudioSystem.shared.play('button');
      this.audioButtonText.setText(this.audioLabel());
    };
    box.setInteractive({ useHandCursor: true }).on('pointerdown', toggle);
    this.audioButtonText.setInteractive({ useHandCursor: true }).on('pointerdown', toggle);
  }

  private audioLabel(): string {
    return AudioSystem.shared.isEnabled ? '音声 ON' : '音声 OFF';
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
