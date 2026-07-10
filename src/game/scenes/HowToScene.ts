import Phaser from 'phaser';
import { LASER_Y, PLAYER_X, TARGET_X } from '../constants';
import { Laser } from '../entities/Laser';
import { AudioSystem } from '../systems/AudioSystem';
import { UI_COLORS, createNeonButton, drawNeonBackdrop, drawNeonPanel, textStyle } from '../ui/theme';

export class HowToScene extends Phaser.Scene {
  private gateTop!: Phaser.GameObjects.Rectangle;
  private gateBottom!: Phaser.GameObjects.Rectangle;
  private demoText!: Phaser.GameObjects.Text;

  public constructor() {
    super('HowToScene');
  }

  public create(): void {
    drawNeonBackdrop(this, 'menu');
    this.add.text(480, 64, '遊び方', textStyle(40, '#f7fbff', true)).setOrigin(0.5).setShadow(0, 0, '#42f8ff', 12);
    this.add.text(480, 108, '色と動きを読んで、スキマが重なる瞬間を撃つ', textStyle(20, '#42f8ff')).setOrigin(0.5);

    drawNeonPanel(this, 184, 146, 592, 228, UI_COLORS.cyan);
    this.add.rectangle(PLAYER_X + 12, LASER_Y, 72, 34, UI_COLORS.panelSoft, 1).setStrokeStyle(2, UI_COLORS.cyan);
    this.add.text(PLAYER_X + 12, LASER_Y + 46, 'PLAYER', textStyle(13, '#8effff', true)).setOrigin(0.5);
    this.add.circle(TARGET_X, LASER_Y, 34, 0x091627, 1).setStrokeStyle(3, UI_COLORS.magenta);
    this.add.text(TARGET_X, LASER_Y + 50, 'CORE', textStyle(13, '#ffb6fa', true)).setOrigin(0.5);
    this.gateTop = this.add.rectangle(500, LASER_Y - 72, 58, 106, 0x0b8bd7, 1).setStrokeStyle(3, UI_COLORS.cyan);
    this.gateBottom = this.add.rectangle(500, LASER_Y + 72, 58, 106, 0xd53c51, 1).setStrokeStyle(3, UI_COLORS.red);
    this.demoText = this.add.text(480, 396, '', textStyle(26, '#42f8ff', true)).setOrigin(0.5);

    this.add.text(258, 414, '青: 標準', textStyle(17, '#8effff')).setOrigin(0.5);
    this.add.text(410, 414, '赤: 高速', textStyle(17, '#ffb0bd')).setOrigin(0.5);
    this.add.text(594, 414, '黄: 反転回転', textStyle(17, '#ffe66d')).setOrigin(0.5);

    this.tweens.add({
      targets: this.gateTop,
      y: LASER_Y - 142,
      duration: 760,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.gateBottom,
      y: LASER_Y + 142,
      duration: 760,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.time.addEvent({
      delay: 1520,
      loop: true,
      callback: () => this.playDemoShot(),
    });

    createNeonButton(this, 480, 474, 180, 42, '戻る', () => {
      AudioSystem.shared.play('button');
      this.scene.start('TitleScene');
    }, { accent: UI_COLORS.magenta, fontSize: 20 });
  }

  private playDemoShot(): void {
    Laser.fire(this, true);
    AudioSystem.shared.play('laser');
    this.demoText.setText('NOW!');
    this.demoText.setAlpha(1);
    this.demoText.setY(396);
    this.tweens.add({
      targets: this.demoText,
      alpha: 0,
      y: 372,
      duration: 520,
    });
  }
}
