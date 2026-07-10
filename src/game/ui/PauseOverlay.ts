import Phaser from 'phaser';
import { UI_COLORS, createNeonButton, drawNeonPanel, textStyle } from './theme';

export class PauseOverlay {
  private readonly group: Phaser.GameObjects.GameObject[] = [];

  public constructor(scene: Phaser.Scene, onResume: () => void, onTitle: () => void) {
    const shade = scene.add.rectangle(480, 270, 960, 540, 0x02040b, 0.72).setDepth(80);
    const panel = drawNeonPanel(scene, 334, 176, 292, 214, UI_COLORS.cyan, 81);
    const title = scene.add.text(480, 226, 'PAUSE', textStyle(42, '#f7fbff', true)).setOrigin(0.5).setDepth(82);
    title.setShadow(0, 0, '#42f8ff', 12);
    const resume = createNeonButton(scene, 480, 298, 190, 42, '再開', onResume, { accent: UI_COLORS.cyan, depth: 82 });
    const titleButton = createNeonButton(scene, 480, 350, 190, 42, 'タイトルへ', onTitle, { accent: UI_COLORS.magenta, depth: 82 });
    this.group.push(shade, panel, title, resume, titleButton);
  }

  public destroy(): void {
    this.group.forEach((item) => item.destroy());
  }
}
