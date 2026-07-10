import Phaser from 'phaser';
import type { CollisionShape, MovementType, ObstacleDefinition, Vector2 } from '../types/game';
import { DEBUG_COLLISION } from '../constants';
import { createObstacleCollisionShapes } from './obstacleGeometry';

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
  protected elapsedSeconds = 0;

  protected constructor(
    protected readonly scene: Phaser.Scene,
    protected readonly definition: ObstacleDefinition,
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

  public update(elapsedSeconds: number): void {
    this.elapsedSeconds = elapsedSeconds;
    this.position = this.resolvePosition(elapsedSeconds);
    this.rotation = (this.definition.rotation ?? 0) + elapsedSeconds * (this.definition.angularSpeed ?? 0) + this.phase;
    this.render();
  }

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
    return this.getCollisionShapes()[0];
  }

  public getCollisionShapes(): CollisionShape[] {
    return createObstacleCollisionShapes(this.definition, this.elapsedSeconds);
  }

  protected render(): void {
    this.graphic.clear();
    this.getCollisionShapes().forEach((shape, index) => {
      const palette = getObstaclePalette(this.definition.colorVariant, index);
      this.graphic.lineStyle(2, palette.stroke, 0.95);
      this.graphic.fillStyle(palette.fill, 0.92);

      if (shape.type === 'aabb') {
        this.graphic.fillRect(shape.box.x, shape.box.y, shape.box.width, shape.box.height);
        this.graphic.strokeRect(shape.box.x, shape.box.y, shape.box.width, shape.box.height);
        this.graphic.lineStyle(1, palette.highlight, 0.6);
        this.graphic.lineBetween(shape.box.x + 6, shape.box.y + 6, shape.box.x + shape.box.width - 6, shape.box.y + 6);
        this.graphic.lineBetween(shape.box.x + 6, shape.box.y + shape.box.height - 6, shape.box.x + shape.box.width - 6, shape.box.y + shape.box.height - 6);
      } else {
        const points = shape.type === 'obb' ? this.obbPoints(shape.box) : shape.polygon.points;
        const phaserPoints = points.map((point) => new Phaser.Math.Vector2(point.x, point.y));
        this.graphic.fillPoints(phaserPoints, true);
        this.graphic.strokePoints(phaserPoints, true);
      }
    });

    if (DEBUG_COLLISION) {
      this.graphic.lineStyle(1, 0x42f8ff, 0.8);
      this.getCollisionShapes().forEach((shape) => {
        if (shape.type === 'aabb') {
          this.graphic.strokeRect(shape.box.x, shape.box.y, shape.box.width, shape.box.height);
          return;
        }
        const points = shape.type === 'obb' ? this.obbPoints(shape.box) : shape.polygon.points;
        this.graphic.strokePoints(points.map((point) => new Phaser.Math.Vector2(point.x, point.y)), true);
      });
    }
  }

  private resolvePosition(elapsedSeconds: number): Vector2 {
    if (this.movementType === 'vertical') {
      return {
        x: this.basePosition.x,
        y: this.basePosition.y + Math.sin(elapsedSeconds * this.speed + this.phase) * this.amplitude,
      };
    }
    if (this.movementType === 'horizontal') {
      return {
        x: this.basePosition.x + Math.sin(elapsedSeconds * this.speed + this.phase) * this.amplitude,
        y: this.basePosition.y,
      };
    }
    return { ...this.basePosition };
  }

  private obbPoints(box: { center: Vector2; width: number; height: number; rotation: number }): Vector2[] {
    const halfW = box.width / 2;
    const halfH = box.height / 2;
    const cos = Math.cos(box.rotation);
    const sin = Math.sin(box.rotation);
    return [
      { x: -halfW, y: -halfH },
      { x: halfW, y: -halfH },
      { x: halfW, y: halfH },
      { x: -halfW, y: halfH },
    ].map((corner) => ({
      x: box.center.x + corner.x * cos - corner.y * sin,
      y: box.center.y + corner.x * sin + corner.y * cos,
    }));
  }
}

function getObstaclePalette(variant: ObstacleDefinition['colorVariant'], index: number): { fill: number; stroke: number; highlight: number } {
  const palettes = {
    cyan: { fill: index % 2 === 0 ? 0x0b8bd7 : 0x0a5fb6, stroke: 0x8effff, highlight: 0xd8ffff },
    magenta: { fill: index % 2 === 0 ? 0x7b2ee6 : 0x5219a8, stroke: 0xff85f7, highlight: 0xffd5fb },
    red: { fill: index % 2 === 0 ? 0xd53c51 : 0x9e1e35, stroke: 0xffb0bd, highlight: 0xffffff },
    amber: { fill: index % 2 === 0 ? 0xdb9b1f : 0xb56612, stroke: 0xffe66d, highlight: 0xffffff },
  };

  return palettes[variant ?? 'cyan'];
}
