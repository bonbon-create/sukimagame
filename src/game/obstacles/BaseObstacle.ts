import Phaser from 'phaser';
import type { CollisionShape, MovementType, ObstacleDefinition, Vector2 } from '../types/game';

export abstract class BaseObstacle {
  public readonly id: string;
  public readonly movementType: MovementType;
  public readonly dimensions: { width: number; height: number };
  public readonly amplitude: number;
  public readonly speed: number;
  public readonly phase: number;
  public readonly basePosition: Vector2;
  public position: Vector2;
  public rotation = 0;

  protected readonly graphic: Phaser.GameObjects.Graphics;

  protected constructor(
    protected readonly scene: Phaser.Scene,
    definition: ObstacleDefinition,
    movementType: MovementType,
  ) {
    this.id = definition.id;
    this.movementType = movementType;
    this.basePosition = { x: definition.x, y: definition.y };
    this.position = { ...this.basePosition };
    this.dimensions = { width: definition.width, height: definition.height };
    this.amplitude = definition.amplitude;
    this.speed = definition.speed;
    this.phase = definition.phase;
    this.graphic = scene.add.graphics();
  }

  public abstract update(elapsedSeconds: number): void;

  public reset(): void {
    this.position = { ...this.basePosition };
    this.rotation = 0;
    this.render();
  }

  public destroyAnimation(): void {
    this.scene.tweens.add({
      targets: this.graphic,
      y: 90,
      alpha: 0,
      duration: 450,
      ease: 'Quad.easeIn',
      onComplete: () => this.graphic.destroy(),
    });
  }

  public destroy(): void {
    this.graphic.destroy();
  }

  public getCollisionShape(): CollisionShape {
    return {
      type: 'aabb',
      box: {
        x: this.position.x - this.dimensions.width / 2,
        y: this.position.y - this.dimensions.height / 2,
        width: this.dimensions.width,
        height: this.dimensions.height,
      },
    };
  }

  protected render(): void {
    const { width, height } = this.dimensions;
    this.graphic.clear();
    this.graphic.lineStyle(2, 0xff4ff6, 0.95);
    this.graphic.fillStyle(0x1c153d, 0.92);
    this.graphic.fillRect(this.position.x - width / 2, this.position.y - height / 2, width, height);
    this.graphic.strokeRect(this.position.x - width / 2, this.position.y - height / 2, width, height);
    this.graphic.lineStyle(1, 0x42f8ff, 0.5);
    this.graphic.lineBetween(this.position.x - width / 2, this.position.y, this.position.x + width / 2, this.position.y);
  }
}
