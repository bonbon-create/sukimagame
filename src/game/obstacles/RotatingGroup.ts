import Phaser from 'phaser';
import type { ObstacleDefinition } from '../types/game';
import { BaseObstacle } from './BaseObstacle';

export class RotatingGroup extends BaseObstacle {
  public constructor(scene: Phaser.Scene, definition: ObstacleDefinition) {
    super(scene, definition, 'rotatingGroup');
    this.render();
  }
}
