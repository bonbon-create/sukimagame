import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { UI_COLORS, createNeonButton, drawNeonBackdrop, textStyle } from '../ui/theme';

export class TitleScene extends Phaser.Scene {
  private audioButton!: Phaser.GameObjects.Container;

  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    drawNeonBackdrop(this, 'menu');
    this.createHero();
    this.createMainActions();
    this.createInfoStrip();
    this.createAudioButton();
  }

  private createHero(): void {
    const panel = this.add.graphics();
    panel.fillStyle(0x050b18, 0.82);
    panel.fillRoundedRect(214, 72, 532, 186, 10);
    panel.lineStyle(3, UI_COLORS.cyan, 0.86);
    panel.strokeRoundedRect(214, 72, 532, 186, 10);
    panel.lineStyle(1, UI_COLORS.magenta, 0.62);
    panel.strokeRoundedRect(228, 86, 504, 158, 8);

    const title = this.add.text(480, 122, '瞬間突破', textStyle(54, '#f7fbff', true)).setOrigin(0.5);
    title.setShadow(0, 0, '#42f8ff', 16, true, true);
    const subtitle = this.add.text(480, 178, 'NEON GAP', textStyle(42, '#42f8ff', true)).setOrigin(0.5);
    subtitle.setShadow(0, 0, '#ff4ff6', 14, true, true);
    this.add.text(480, 226, '動く障害物のスキマを狙って、コアを撃ち抜く', textStyle(19, '#ffb6fa')).setOrigin(0.5);

    const scan = this.add.rectangle(252, 252, 130, 2, UI_COLORS.cyan, 0.9);
    this.tweens.add({
      targets: scan,
      x: 708,
      alpha: 0.25,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createMainActions(): void {
    createNeonButton(this, 480, 326, 380, 70, 'ゲームスタート', () => this.startScene('GameScene'), {
      accent: UI_COLORS.cyan,
      fontSize: 28,
    });
    this.add.text(480, 374, 'タップ / クリック / Space で発射', textStyle(16, '#aeefff')).setOrigin(0.5);
    createNeonButton(this, 394, 430, 170, 46, '遊び方', () => this.startScene('HowToScene'), {
      accent: UI_COLORS.magenta,
      fontSize: 20,
    });
    createNeonButton(this, 566, 430, 170, 46, '記録', () => this.startScene('RecordsScene'), {
      accent: UI_COLORS.amber,
      fontSize: 20,
    });
  }

  private createInfoStrip(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x091226, 0.78);
    graphics.fillRoundedRect(246, 486, 468, 30, 6);
    graphics.lineStyle(1, UI_COLORS.cyan, 0.42);
    graphics.strokeRoundedRect(246, 486, 468, 30, 6);
    this.add.text(480, 501, '全30ステージ / 60秒チャレンジ / 端末内ランキング', textStyle(15, '#d8faff')).setOrigin(0.5);
  }

  private startScene(sceneKey: string): void {
    AudioSystem.shared.play('button');
    this.scene.start(sceneKey);
  }

  private createAudioButton(): void {
    this.audioButton = createNeonButton(this, 824, 44, 148, 36, this.audioLabel(), () => {
      AudioSystem.shared.toggle();
      AudioSystem.shared.play('button');
      this.audioButton.destroy();
      this.createAudioButton();
    }, {
      accent: AudioSystem.shared.isEnabled ? UI_COLORS.cyan : UI_COLORS.red,
      fontSize: 16,
    });
  }

  private audioLabel(): string {
    return AudioSystem.shared.isEnabled ? '音声 ON' : '音声 OFF';
  }
}
