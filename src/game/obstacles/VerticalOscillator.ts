import type { ObstacleDefinition } from '../types/game';
import { BaseObstacle } from './BaseObstacle';

export class VerticalOscillator extends BaseObstacle {
  public constructor(scene: Phaser.Scene, definition: ObstacleDefinition) {
    super(scene, definition, 'vertical');
    this.render();
  }

  public update(elapsedSeconds: number): void {
    this.position = {
      x: this.basePosition.x,
      y: this.basePosition.y + Math.sin(elapsedSeconds * this.speed + this.phase) * this.amplitude,
    };
    this.render();
  }
}
