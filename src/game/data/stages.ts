import { STAGE_TRANSITION_MS } from '../constants';
import type { StageDefinition } from '../types/game';

export const MVP_STAGES: StageDefinition[] = [
  {
    id: 'mvp-01',
    displayNumber: 1,
    difficulty: 1,
    backgroundVariant: 'cyan',
    targetVariant: 'hex-core',
    transitionDuration: STAGE_TRANSITION_MS,
    obstacles: [
      { id: 'v-1-a', kind: 'verticalBlock', x: 420, y: 174, width: 52, height: 96, amplitude: 86, speed: 1.5, phase: 0 },
      { id: 'v-1-b', kind: 'verticalBlock', x: 520, y: 270, width: 52, height: 96, amplitude: 86, speed: 1.5, phase: Math.PI },
    ],
  },
  {
    id: 'mvp-02',
    displayNumber: 2,
    difficulty: 2,
    backgroundVariant: 'magenta',
    targetVariant: 'hex-core',
    transitionDuration: STAGE_TRANSITION_MS,
    obstacles: [
      { id: 'v-2-a', kind: 'verticalBlock', x: 360, y: 160, width: 44, height: 112, amplitude: 92, speed: 1.85, phase: 0.2 },
      { id: 'v-2-b', kind: 'verticalBlock', x: 460, y: 305, width: 44, height: 112, amplitude: 92, speed: 1.85, phase: 2.8 },
      { id: 'v-2-c', kind: 'verticalBlock', x: 560, y: 180, width: 44, height: 112, amplitude: 92, speed: 1.85, phase: 1.4 },
    ],
  },
  {
    id: 'mvp-03',
    displayNumber: 3,
    difficulty: 3,
    backgroundVariant: 'amber',
    targetVariant: 'hex-core',
    transitionDuration: STAGE_TRANSITION_MS,
    obstacles: [
      { id: 'v-3-a', kind: 'verticalBlock', x: 342, y: 150, width: 42, height: 120, amplitude: 102, speed: 2.1, phase: 0 },
      { id: 'v-3-b', kind: 'verticalBlock', x: 442, y: 312, width: 42, height: 120, amplitude: 102, speed: 2.1, phase: Math.PI },
      { id: 'v-3-c', kind: 'verticalBlock', x: 542, y: 150, width: 42, height: 120, amplitude: 102, speed: 2.1, phase: 0.7 },
      { id: 'v-3-d', kind: 'verticalBlock', x: 642, y: 312, width: 42, height: 120, amplitude: 102, speed: 2.1, phase: Math.PI + 0.7 },
    ],
  },
];
