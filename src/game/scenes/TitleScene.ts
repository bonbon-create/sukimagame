import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { UI_COLORS, createNeonButton, drawNeonBackdrop, textStyle } from '../ui/theme';

export class TitleScene extends Phaser.Scene {
  private audioButton!: Phaser.GameObjects.Container;
  private readonly previewBounds = new Phaser.Geom.Rectangle(122, 122, 716, 226);

  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    drawNeonBackdrop(this, 'title');
    this.createHeader();
    this.createGameplayPreview();
    this.createMainActions();
    this.createAudioButton();
    this.input.keyboard?.once('keydown-SPACE', () => this.startScene('GameScene'));
  }

  private createHeader(): void {
    const title = this.add.text(480, 44, '瞬間突破', textStyle(46, '#f7fbff', true)).setOrigin(0.5);
    title.setShadow(0, 0, '#42f8ff', 18, true, true);

    const subtitle = this.add.text(480, 88, '横画面ワンタップゲーム', textStyle(22, '#42f8ff', true)).setOrigin(0.5);
    subtitle.setShadow(0, 0, '#ff4ff6', 12, true, true);

    this.add.text(480, 112, 'スキマができた瞬間にコアを撃ち抜く', textStyle(17, '#d8faff')).setOrigin(0.5);
  }

  private createGameplayPreview(): void {
    const { x, y, width, height } = this.previewBounds;
    const centerY = y + height / 2;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x030711, 0.9);
    graphics.fillRoundedRect(x, y, width, height, 8);
    graphics.lineStyle(3, UI_COLORS.cyan, 0.85);
    graphics.strokeRoundedRect(x, y, width, height, 8);
    graphics.lineStyle(1, UI_COLORS.magenta, 0.5);
    graphics.strokeRoundedRect(x + 10, y + 10, width - 20, height - 20, 6);
    graphics.lineStyle(1, UI_COLORS.cyan, 0.26);
    graphics.lineBetween(x + 84, centerY, x + width - 84, centerY);

    this.drawPreviewHexGrid(graphics, x + 34, y + 22, width - 68, height - 44);
    this.drawPreviewFacility(graphics, x + 18, centerY);
    this.drawPreviewFacility(graphics, x + width - 98, centerY);
    this.drawPreviewPlayer(graphics, x + 94, centerY);
    this.drawPreviewCore(graphics, x + width - 92, centerY);
    this.createPreviewObstacles(centerY);
    this.createTapCue(x + 126, centerY + 52);

    const laser = this.add.rectangle(x + 126, centerY, 0, 4, UI_COLORS.magenta, 0.9).setOrigin(0, 0.5);
    this.tweens.add({
      targets: laser,
      width: width - 230,
      alpha: 0.16,
      duration: 1150,
      delay: 320,
      repeat: -1,
      repeatDelay: 700,
      ease: 'Sine.easeInOut',
    });
  }

  private createMainActions(): void {
    const startGlow = this.add.graphics();
    startGlow.lineStyle(4, UI_COLORS.cyan, 0.66);
    startGlow.strokeRoundedRect(242, 374, 476, 82, 10);
    this.tweens.add({
      targets: startGlow,
      alpha: 0.32,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    createNeonButton(this, 480, 415, 452, 72, 'ゲームスタート', () => this.startScene('GameScene'), {
      accent: UI_COLORS.cyan,
      fontSize: 30,
    });
    this.add.text(480, 462, 'タップ / クリック / Space でも開始', textStyle(15, '#aeefff')).setOrigin(0.5);

    createNeonButton(this, 388, 500, 174, 42, '遊び方', () => this.startScene('HowToScene'), {
      accent: UI_COLORS.magenta,
      fontSize: 19,
    });
    createNeonButton(this, 572, 500, 174, 42, '記録', () => this.startScene('RecordsScene'), {
      accent: UI_COLORS.amber,
      fontSize: 19,
    });
    this.add.text(480, 532, '全30ステージ / 60秒チャレンジ / 端末内ランキング', textStyle(13, '#d8faff')).setOrigin(0.5);
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

  private drawPreviewHexGrid(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number): void {
    graphics.lineStyle(1, 0x203955, 0.52);
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        const centerX = x + col * 62 + (row % 2) * 31;
        const centerY = y + row * 42;
        if (centerX > x + width || centerY > y + height) {
          continue;
        }
        this.strokeHexagon(graphics, centerX, centerY, 24);
      }
    }
  }

  private drawPreviewFacility(graphics: Phaser.GameObjects.Graphics, x: number, centerY: number): void {
    graphics.fillStyle(0x101a32, 0.96);
    graphics.fillRoundedRect(x, centerY - 56, 82, 112, 6);
    graphics.lineStyle(2, 0x8aa4d6, 0.72);
    graphics.strokeRoundedRect(x + 6, centerY - 46, 70, 92, 5);
    graphics.lineStyle(1, UI_COLORS.cyan, 0.5);
    graphics.lineBetween(x + 16, centerY - 24, x + 66, centerY - 24);
    graphics.lineBetween(x + 16, centerY + 24, x + 66, centerY + 24);
  }

  private drawPreviewPlayer(graphics: Phaser.GameObjects.Graphics, x: number, y: number): void {
    graphics.fillStyle(0xf7fbff, 1);
    graphics.fillCircle(x, y - 24, 9);
    graphics.lineStyle(5, 0xf7fbff, 1);
    graphics.lineBetween(x, y - 14, x - 8, y + 20);
    graphics.lineBetween(x - 6, y - 2, x - 20, y + 20);
    graphics.lineBetween(x + 2, y + 18, x + 20, y + 28);
    graphics.lineBetween(x + 4, y - 12, x + 30, y - 10);
    graphics.fillStyle(UI_COLORS.magenta, 0.96);
    graphics.fillTriangle(x - 7, y - 12, x - 24, y + 17, x + 2, y + 8);
    graphics.fillStyle(0xd8faff, 1);
    graphics.fillRoundedRect(x + 27, y - 16, 22, 10, 3);
  }

  private drawPreviewCore(graphics: Phaser.GameObjects.Graphics, x: number, y: number): void {
    graphics.fillStyle(0x0b203d, 0.96);
    this.fillHexagon(graphics, x, y, 36);
    graphics.lineStyle(4, UI_COLORS.cyan, 0.92);
    this.strokeHexagon(graphics, x, y, 36);
    graphics.fillStyle(UI_COLORS.magenta, 0.95);
    graphics.fillTriangle(x - 46, y, x - 22, y - 18, x - 22, y + 18);
    graphics.fillStyle(0xf7fbff, 0.92);
    this.fillHexagon(graphics, x, y, 17);
  }

  private createPreviewObstacles(centerY: number): void {
    const blocks = [
      this.createPreviewBlock(352, centerY - 46, 86, 32, UI_COLORS.cyan),
      this.createPreviewBlock(352, centerY + 46, 86, 32, UI_COLORS.cyan),
      this.createPreviewBlock(480, centerY, 74, 34, UI_COLORS.amber),
      this.createPreviewBlock(608, centerY - 46, 86, 32, UI_COLORS.magenta),
      this.createPreviewBlock(608, centerY + 46, 86, 32, UI_COLORS.magenta),
    ];

    blocks.forEach((block, index) => {
      this.tweens.add({
        targets: block,
        y: block.y + (index % 2 === 0 ? 26 : -26),
        duration: 980 + index * 110,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    const rotator = this.add.container(480, centerY);
    rotator.add([
      this.createPreviewBlock(0, -58, 34, 34, UI_COLORS.cyan),
      this.createPreviewBlock(0, 58, 34, 34, UI_COLORS.cyan),
      this.createPreviewBlock(-58, 0, 34, 34, UI_COLORS.cyan),
      this.createPreviewBlock(58, 0, 34, 34, UI_COLORS.cyan),
    ]);
    this.tweens.add({
      targets: rotator,
      angle: 360,
      duration: 3800,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private createPreviewBlock(x: number, y: number, width: number, height: number, accent: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const graphics = this.add.graphics();
    graphics.fillStyle(0x098bc4, 0.88);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 5);
    graphics.fillStyle(0x8afcff, 0.56);
    graphics.fillRoundedRect(-width / 2 + 5, -height / 2 + 4, width - 10, height / 2 - 2, 4);
    graphics.lineStyle(3, accent, 0.95);
    graphics.strokeRoundedRect(-width / 2, -height / 2, width, height, 5);
    graphics.lineStyle(1, 0xffffff, 0.42);
    graphics.lineBetween(-width / 2 + 9, -height / 2 + 7, width / 2 - 9, -height / 2 + 7);
    container.add(graphics);
    return container;
  }

  private createTapCue(x: number, y: number): void {
    const cue = this.add.container(x, y);
    const ring = this.add.circle(0, 0, 23, UI_COLORS.cyan, 0.12);
    ring.setStrokeStyle(2, UI_COLORS.cyan, 0.8);
    const dot = this.add.circle(0, 0, 6, UI_COLORS.white, 0.92);
    const label = this.add.text(42, 0, 'TAP', textStyle(15, '#f7fbff', true)).setOrigin(0, 0.5);
    cue.add([ring, dot, label]);
    this.tweens.add({
      targets: ring,
      scale: 1.45,
      alpha: 0.18,
      duration: 760,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeOut',
    });
  }

  private fillHexagon(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
    const points = this.hexagonPoints(x, y, radius);
    graphics.fillPoints(points, true);
  }

  private strokeHexagon(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
    const points = this.hexagonPoints(x, y, radius);
    graphics.strokePoints(points, true);
  }

  private hexagonPoints(x: number, y: number, radius: number): Phaser.Math.Vector2[] {
    return Array.from({ length: 6 }, (_, index) => {
      const angle = Phaser.Math.DegToRad(30 + index * 60);
      return new Phaser.Math.Vector2(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    });
  }
}
