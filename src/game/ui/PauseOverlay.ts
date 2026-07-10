import Phaser from 'phaser';

export class PauseOverlay {
  private readonly group: Phaser.GameObjects.GameObject[] = [];

  public constructor(scene: Phaser.Scene, onResume: () => void, onTitle: () => void) {
    const shade = scene.add.rectangle(480, 270, 960, 540, 0x02040b, 0.72).setDepth(80);
    const title = scene.add.text(480, 210, 'PAUSE', {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '46px',
      color: '#f7fbff',
    }).setOrigin(0.5).setDepth(81);
    const resume = createButton(scene, 480, 292, '再開', onResume);
    const titleButton = createButton(scene, 480, 352, 'タイトルへ', onTitle);
    this.group.push(shade, title, ...resume, ...titleButton);
  }

  public destroy(): void {
    this.group.forEach((item) => item.destroy());
  }
}

function createButton(scene: Phaser.Scene, x: number, y: number, label: string, onClick: () => void): Phaser.GameObjects.GameObject[] {
  const box = scene.add.rectangle(x, y, 210, 42, 0x101a32, 1).setStrokeStyle(2, 0x42f8ff).setDepth(81);
  const text = scene.add.text(x, y, label, {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '22px',
    color: '#f7fbff',
  }).setOrigin(0.5).setDepth(82);
  box.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  text.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  return [box, text];
}
