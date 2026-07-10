import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { calculateAccuracy, StorageSystem } from '../systems/StorageSystem';
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

    this.cameras.main.setBackgroundColor('#050712');
    this.add.text(480, 92, cleared ? '突破成功' : '時間切れ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '48px',
      color: cleared ? '#42f8ff' : '#ff5b5b',
    }).setOrigin(0.5);
    this.add.text(480, 158, `到達ステージ ${data.reachedStage}`, this.bodyStyle()).setOrigin(0.5);
    this.add.text(480, 202, `残り時間 ${data.remainingTime.toFixed(1)} 秒`, this.bodyStyle()).setOrigin(0.5);
    this.add.text(480, 246, `1Shot成功 ${data.oneShotCount}`, this.bodyStyle()).setOrigin(0.5);
    this.add.text(480, 290, `発射数 ${data.shotCount}`, this.bodyStyle()).setOrigin(0.5);
    this.add.text(480, 334, `命中率 ${accuracy}%`, this.bodyStyle()).setOrigin(0.5);
    this.add.text(480, 382, `ベスト記録 ${best ? formatBest(best) : '-'}`, {
      ...this.bodyStyle(),
      color: '#42f8ff',
    }).setOrigin(0.5);
    this.createButton(360, 458, 'リトライ', () => this.startScene('GameScene'));
    this.createButton(560, 458, 'タイトルへ', () => this.startScene('TitleScene'));
    this.createButton(740, 458, '記録', () => this.startScene('RecordsScene'));
  }

  private startScene(sceneKey: string): void {
    AudioSystem.shared.play('button');
    this.scene.start(sceneKey);
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = this.add.rectangle(x, y, 150, 42, 0x101a32, 1).setStrokeStyle(2, 0x42f8ff);
    const text = this.add.text(x, y, label, this.bodyStyle()).setOrigin(0.5);
    button.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  }

  private bodyStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      color: '#f7fbff',
    };
  }
}

function formatBest(record: ResultPayload): string {
  return record.cleared ? `CLEAR ${record.remainingTime.toFixed(1)}秒` : `STAGE ${record.reachedStage}`;
}
