import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { StorageSystem } from '../systems/StorageSystem';

export class RecordsScene extends Phaser.Scene {
  private rows: Phaser.GameObjects.GameObject[] = [];

  public constructor() {
    super('RecordsScene');
  }

  public create(): void {
    this.drawBackground();
    this.add.text(480, 62, '記録', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '42px',
      color: '#f7fbff',
    }).setOrigin(0.5);
    this.renderRecords();
    this.createButton(380, 480, '記録削除', () => {
      AudioSystem.shared.play('button');
      StorageSystem.clearRecords();
      this.renderRecords();
    });
    this.createButton(580, 480, '戻る', () => {
      AudioSystem.shared.play('button');
      this.scene.start('TitleScene');
    });
  }

  private renderRecords(): void {
    this.rows.forEach((row) => row.destroy());
    this.rows = [];
    const records = StorageSystem.loadRecords();

    if (records.length === 0) {
      this.rows.push(this.add.text(480, 250, 'まだ記録がありません', this.rowStyle('#42f8ff')).setOrigin(0.5));
      return;
    }

    this.rows.push(this.add.text(166, 112, 'RANK', this.headerStyle()).setOrigin(0.5));
    this.rows.push(this.add.text(282, 112, 'RESULT', this.headerStyle()).setOrigin(0.5));
    this.rows.push(this.add.text(454, 112, 'STAGE', this.headerStyle()).setOrigin(0.5));
    this.rows.push(this.add.text(608, 112, 'TIME', this.headerStyle()).setOrigin(0.5));
    this.rows.push(this.add.text(760, 112, 'HIT', this.headerStyle()).setOrigin(0.5));

    records.forEach((record, index) => {
      const y = 150 + index * 30;
      const color = record.cleared ? '#42f8ff' : '#f7fbff';
      this.rows.push(this.add.text(166, y, `${index + 1}`, this.rowStyle(color)).setOrigin(0.5));
      this.rows.push(this.add.text(282, y, record.cleared ? 'CLEAR' : 'FAILED', this.rowStyle(color)).setOrigin(0.5));
      this.rows.push(this.add.text(454, y, `${record.reachedStage}`, this.rowStyle(color)).setOrigin(0.5));
      this.rows.push(this.add.text(608, y, `${record.remainingTime.toFixed(1)}秒`, this.rowStyle(color)).setOrigin(0.5));
      this.rows.push(this.add.text(760, y, `${record.accuracy}%`, this.rowStyle(color)).setOrigin(0.5));
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const box = this.add.rectangle(x, y, 170, 42, 0x101a32, 1).setStrokeStyle(2, 0x42f8ff);
    const text = this.add.text(x, y, label, this.rowStyle('#f7fbff')).setOrigin(0.5);
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
  }

  private headerStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '18px',
      color: '#ff85f7',
    };
  }

  private rowStyle(color: string): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color,
    };
  }
}
