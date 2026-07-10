import Phaser from 'phaser';

export class EffectsSystem {
  public constructor(private readonly scene: Phaser.Scene) {}

  public spark(x: number, y: number, color = 0xffe66d): void {
    for (let index = 0; index < 10; index += 1) {
      const dot = this.scene.add.circle(x, y, 2 + Math.random() * 2, color, 1);
      this.scene.tweens.add({
        targets: dot,
        x: x + (Math.random() * 2 - 1) * 48,
        y: y + (Math.random() * 2 - 1) * 34,
        alpha: 0,
        duration: 220,
        ease: 'Quad.easeOut',
        onComplete: () => dot.destroy(),
      });
    }
  }

  public targetParticles(x: number, y: number): void {
    for (let index = 0; index < 18; index += 1) {
      const color = index % 2 === 0 ? 0x42f8ff : 0xff4ff6;
      const particle = this.scene.add.circle(x, y, 3, color, 1);
      const angle = (Math.PI * 2 * index) / 18;
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * (48 + Math.random() * 42),
        y: y + Math.sin(angle) * (48 + Math.random() * 42),
        alpha: 0,
        duration: 420,
        ease: 'Sine.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  public explosionSequence(onComplete: () => void): void {
    const flash = this.scene.add.rectangle(480, 270, 960, 540, 0xffffff, 0.92);
    flash.setDepth(100);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 260,
      onComplete: () => flash.destroy(),
    });

    [220, 350, 520, 690, 810].forEach((x, index) => {
      this.scene.time.delayedCall(index * 95, () => {
        this.burst(x, 225 + Math.sin(index) * 70);
      });
    });

    this.scene.time.delayedCall(1050, onComplete);
  }

  private burst(x: number, y: number): void {
    const ring = this.scene.add.circle(x, y, 8, 0xfff2a8, 0.9);
    ring.setDepth(90);
    this.scene.tweens.add({
      targets: ring,
      scale: 8,
      alpha: 0,
      duration: 380,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });
    this.spark(x, y, 0xff5b5b);
  }
}
