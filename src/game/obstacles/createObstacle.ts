import Phaser from 'phaser';
import type { ObstacleDefinition } from '../types/game';
import { ArcGate } from './ArcGate';
import type { BaseObstacle } from './BaseObstacle';
import { HorizontalOscillator } from './HorizontalOscillator';
import { OrbitingBlock } from './OrbitingBlock';
import { RotatingGroup } from './RotatingGroup';
import { RotatingRectangle } from './RotatingRectangle';
import { ShutterGate } from './ShutterGate';
import { SlidingPair } from './SlidingPair';
import { VerticalOscillator } from './VerticalOscillator';

export function createObstacle(scene: Phaser.Scene, definition: ObstacleDefinition): BaseObstacle {
  switch (definition.kind) {
    case 'horizontalBlock':
      return new HorizontalOscillator(scene, definition);
    case 'slidingPair':
      return new SlidingPair(scene, definition);
    case 'rotatingRectangle':
      return new RotatingRectangle(scene, definition);
    case 'rotatingGroup':
      return new RotatingGroup(scene, definition);
    case 'orbitingBlock':
      return new OrbitingBlock(scene, definition);
    case 'arcGate':
      return new ArcGate(scene, definition);
    case 'shutterGate':
      return new ShutterGate(scene, definition);
    case 'verticalBlock':
    case 'staticBlock':
      return new VerticalOscillator(scene, definition);
  }
}
