import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { calculateAccuracy, StorageSystem } from '../systems/StorageSystem';
import { UI_COLORS, createNeonButton, drawNeonBackdrop, drawNeonPanel, textStyle } from '../ui/theme';
import type { ResultPayload } from '../types/game';

export class ResultScene extends Phaser.Scene {
  public constructor() {
    super('ResultScene');
  }

  public create(data: ResultPayload): void {
    const cleared = data.cleared;
    const accuracy = calculateAccuracy(data);
    const records = StorageSystem.saveResult(data);
    const best = records[0];
    const accent = cleared ? UI_COLORS.cyan : UI_COLORS.red;

    drawNeonBackdrop(this, 'menu');
    this.add.text(480, 72, cleared ? '突破成功' : '時間切れ', textStyle(46, cleared ? '#42f8ff' : '#ff5b5b', true))
      .setOrigin(0.5)
      .setShadow(0, 0, cleared ? '#42f8ff' : '#ff5b5b', 16);
    this.add.text(480, 116, cleared ? 'SECURITY CORE DOWN' : 'SYSTEM OVERLOAD', textStyle(16, '#ffb6fa', true)).setOrigin(0.5);

    drawNeonPanel(this, 190, 146, 580, 234, accent);
    this.metric(306, 188, '到達', `STAGE ${data.reachedStage}`, UI_COLORS.cyan);
    this.metric(480, 188, '残り時間', `${data.remainingTime.toFixed(1)} 秒`, UI_COLORS.amber);
    this.metric(654, 188, '命中率', `${accuracy}%`, UI_COLORS.magenta);
    this.metric(360, 286, '1Shot成功', `${data.oneShotCount}`, UI_COLORS.cyan);
    this.metric(600, 286, '発射数', `${data.shotCount}`, UI_COLORS.red);
    this.add.text(480, 348, `ベスト記録  ${best ? formatBest(best) : '-'}`, textStyle(20, '#42f8ff', true)).setOrigin(0.5);

    createNeonButton(this, 326, 446, 158, 44, 'リトライ', () => this.startScene('GameScene'), { accent: UI_COLORS.cyan });
    createNeonButton(this, 510, 446, 158, 44, 'タイトルへ', () => this.startScene('TitleScene'), { accent: UI_COLORS.magenta });
    createNeonButton(this, 694, 446, 136, 44, '記録', () => this.startScene('RecordsScene'), { accent: UI_COLORS.amber });
  }

  private startScene(sceneKey: string): void {
    AudioSystem.shared.play('button');
    this.scene.start(sceneKey);
  }

  private metric(x: number, y: number, label: string, value: string, accent: number): void {
    drawNeonPanel(this, x - 74, y - 30, 148, 74, accent);
    this.add.text(x, y - 10, label, textStyle(14, '#a7b6d8', true)).setOrigin(0.5);
    this.add.text(x, y + 17, value, textStyle(20, '#f7fbff', true)).setOrigin(0.5);
  }
}

function formatBest(record: ResultPayload): string {
  return record.cleared ? `CLEAR ${record.remainingTime.toFixed(1)}秒` : `STAGE ${record.reachedStage}`;
}
