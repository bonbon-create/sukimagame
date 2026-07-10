import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { StorageSystem } from '../systems/StorageSystem';
import { UI_COLORS, createNeonButton, drawNeonBackdrop, drawNeonPanel, textStyle } from '../ui/theme';

export class RecordsScene extends Phaser.Scene {
  private rows: Phaser.GameObjects.GameObject[] = [];

  public constructor() {
    super('RecordsScene');
  }

  public create(): void {
    drawNeonBackdrop(this, 'menu');
    this.add.text(480, 62, '記録', textStyle(42, '#f7fbff', true)).setOrigin(0.5).setShadow(0, 0, '#42f8ff', 14);
    drawNeonPanel(this, 134, 104, 692, 330, UI_COLORS.cyan);
    this.renderRecords();
    createNeonButton(this, 380, 480, 170, 42, '記録削除', () => {
      AudioSystem.shared.play('button');
      StorageSystem.clearRecords();
      this.renderRecords();
    }, { accent: UI_COLORS.red });
    createNeonButton(this, 580, 480, 170, 42, '戻る', () => {
      AudioSystem.shared.play('button');
      this.scene.start('TitleScene');
    }, { accent: UI_COLORS.magenta });
  }

  private renderRecords(): void {
    this.rows.forEach((row) => row.destroy());
    this.rows = [];
    const records = StorageSystem.loadRecords();

    if (records.length === 0) {
      this.rows.push(this.add.text(480, 270, 'まだ記録がありません', textStyle(22, '#42f8ff')).setOrigin(0.5));
      return;
    }

    const headers = [
      ['RANK', 176],
      ['RESULT', 294],
      ['STAGE', 454],
      ['TIME', 608],
      ['HIT', 760],
    ] as const;
    headers.forEach(([label, x]) => this.rows.push(this.add.text(x, 128, label, textStyle(16, '#ff85f7', true)).setOrigin(0.5)));

    records.forEach((record, index) => {
      const y = 164 + index * 28;
      const stripe = this.add.rectangle(480, y, 640, 24, index % 2 === 0 ? 0x0b1228 : 0x101a32, 0.72);
      const color = record.cleared ? '#42f8ff' : '#f7fbff';
      this.rows.push(stripe);
      this.rows.push(this.add.text(176, y, `${index + 1}`, textStyle(17, color, true)).setOrigin(0.5));
      this.rows.push(this.add.text(294, y, record.cleared ? 'CLEAR' : 'FAILED', textStyle(17, color, true)).setOrigin(0.5));
      this.rows.push(this.add.text(454, y, `${record.reachedStage}`, textStyle(17, color)).setOrigin(0.5));
      this.rows.push(this.add.text(608, y, `${record.remainingTime.toFixed(1)}秒`, textStyle(17, color)).setOrigin(0.5));
      this.rows.push(this.add.text(760, y, `${record.accuracy}%`, textStyle(17, color)).setOrigin(0.5));
    });
  }
}
