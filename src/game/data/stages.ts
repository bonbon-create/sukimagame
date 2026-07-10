import { LASER_Y, STAGE_TRANSITION_MS } from '../constants';
import type { ObstacleDefinition, StageDefinition } from '../types/game';

type PatternBuilder = (stageNumber: number, tier: number) => ObstacleDefinition[];

const variants: StageDefinition['backgroundVariant'][] = ['cyan', 'magenta', 'amber'];

const patternBuilders: PatternBuilder[] = [
  verticalTwoBlocks,
  verticalFourBlocks,
  shutterColumns,
  phasedBlocks,
  mixedSquaresAndBars,
  rotatingSingleBar,
  rotatingDiamondGroup,
  twinArcGates,
  centralArcGate,
  compositeGate,
];

export const STAGES: StageDefinition[] = Array.from({ length: 30 }, (_, index) => {
  const stageNumber = index + 1;
  const tier = Math.floor(index / 10);
  const patternIndex = index % patternBuilders.length;

  return {
    id: `stage-${stageNumber.toString().padStart(2, '0')}`,
    displayNumber: stageNumber,
    difficulty: stageNumber,
    backgroundVariant: variants[index % variants.length],
    targetVariant: 'hex-core',
    warningThreshold: 10,
    transitionDuration: Math.max(440, STAGE_TRANSITION_MS - tier * 60),
    obstacles: patternBuilders[patternIndex](stageNumber, tier),
  };
});

export const MVP_STAGES = STAGES.slice(0, 3);

function verticalTwoBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const speed = 1.35 + tier * 0.3;
  const amp = 128 - tier * 14;
  const height = 74 + tier * 16;
  return [
    block(stageNumber, 'a', 'verticalBlock', 414, LASER_Y, 50 + tier * 4, height, amp, speed, 0),
    block(stageNumber, 'b', 'verticalBlock', 536, LASER_Y, 50 + tier * 4, height, amp, speed, Math.PI),
  ];
}

function verticalFourBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const speed = 1.58 + tier * 0.3;
  const amp = 126 - tier * 13;
  const height = 70 + tier * 15;
  const phases = [0, Math.PI, 0.42, Math.PI + 0.42];
  return [342, 444, 546, 648].map((x, index) =>
    block(stageNumber, `${index}`, 'verticalBlock', x, LASER_Y, 42 + tier * 3, height, amp, speed, phases[index]),
  );
}

function shutterColumns(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'shutter', 'shutterGate', 500, LASER_Y, 54 - tier * 4, 90 + tier * 9, 124 - tier * 12, 1.42 + tier * 0.26, -Math.PI / 2, {
      count: 3 + tier,
      gap: -38 - tier * 8,
      spread: 118 - tier * 6,
    }),
  ];
}

function phasedBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const phases = [0, Math.PI, 0.54, Math.PI + 0.54, 1.08];
  return [320, 414, 508, 602, 696].slice(0, 4 + tier).map((x, index) =>
    block(stageNumber, `${index}`, 'verticalBlock', x, LASER_Y, 40 + tier * 3, 72 + tier * 14, 124 - tier * 12, 1.55 + tier * 0.32, phases[index]),
  );
}

function mixedSquaresAndBars(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'square-a', 'verticalBlock', 358, LASER_Y, 58 + tier * 3, 58 + tier * 8, 124 - tier * 12, 1.65 + tier * 0.28, 0),
    block(stageNumber, 'bar-a', 'verticalBlock', 476, LASER_Y, 44 + tier * 3, 104 + tier * 16, 126 - tier * 12, 1.72 + tier * 0.3, Math.PI),
    block(stageNumber, 'square-b', 'horizontalBlock', 590, 158, 62, 62, 48 + tier * 8, 1.4 + tier * 0.18, Math.PI / 2),
    block(stageNumber, 'bar-b', 'verticalBlock', 676, LASER_Y, 40 + tier * 2, 102 + tier * 14, 120 - tier * 10, 1.92 + tier * 0.24, 0.48),
    block(stageNumber, 'pair', 'slidingPair', 590, LASER_Y, 46, 78 + tier * 8, 112 - tier * 12, 1.36 + tier * 0.24, -Math.PI / 2, {
      gap: -28 - tier * 8,
    }),
  ];
}

function rotatingSingleBar(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'rot-a', 'rotatingRectangle', 458, LASER_Y, 156 + tier * 16, 30 + tier * 4, 118 - tier * 12, 1.18 + tier * 0.2, 0, {
      angularSpeed: 1.15 + tier * 0.3,
    }),
    block(stageNumber, 'v-a', 'verticalBlock', 624, LASER_Y, 44 + tier * 3, 86 + tier * 15, 122 - tier * 12, 1.72 + tier * 0.27, Math.PI),
  ];
}

function rotatingDiamondGroup(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'group', 'rotatingGroup', 500, LASER_Y, 44 + tier * 4, 44 + tier * 4, 0, 0.82 + tier * 0.28, 0, {
      count: 4,
      radius: 112 - tier * 10,
      angularSpeed: 0.78 + tier * 0.26,
    }),
  ];
}

function twinArcGates(stageNumber: number, tier: number): ObstacleDefinition[] {
  const speed = 0.72 + tier * 0.22;
  return [
    block(stageNumber, 'arc-l', 'arcGate', 394, LASER_Y, 0, 24 + tier * 2, 0, speed, 0, {
      radius: 88 - tier * 5,
      thickness: 26 + tier * 4,
      startAngle: -Math.PI * 0.18,
      endAngle: Math.PI * 0.18,
      angularSpeed: speed,
      segments: 16,
    }),
    block(stageNumber, 'arc-r', 'arcGate', 608, LASER_Y, 0, 24 + tier * 2, 0, -speed, 0, {
      radius: 88 - tier * 5,
      thickness: 26 + tier * 4,
      startAngle: Math.PI * 0.82,
      endAngle: Math.PI * 1.18,
      angularSpeed: -speed,
      segments: 16,
    }),
  ];
}

function centralArcGate(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'arc-big', 'arcGate', 500, LASER_Y, 0, 30 + tier * 3, 0, 0.82 + tier * 0.12, 0, {
      radius: 122 - tier * 9,
      thickness: 32 + tier * 5,
      startAngle: -Math.PI * 0.2,
      endAngle: Math.PI * 0.2,
      angularSpeed: 0.72 + tier * 0.22,
      segments: 20,
    }),
    block(stageNumber, 'orbit', 'orbitingBlock', 500, LASER_Y, 42 + tier * 4, 42 + tier * 4, 0, 1.18 + tier * 0.24, 0, {
      radius: 132 - tier * 10,
    }),
  ];
}

function compositeGate(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'v-a', 'verticalBlock', 346, LASER_Y, 40 + tier * 3, 88 + tier * 16, 124 - tier * 13, 1.65 + tier * 0.24, 0),
    block(stageNumber, 'rot', 'rotatingRectangle', 502, LASER_Y, 138 + tier * 16, 30 + tier * 4, 122 - tier * 12, 1.2 + tier * 0.2, Math.PI, {
      angularSpeed: -1.05 - tier * 0.26,
    }),
    block(stageNumber, 'arc', 'arcGate', 642, LASER_Y, 0, 24 + tier * 3, 0, 0.86 + tier * 0.16, 0, {
      radius: 84 - tier * 5,
      thickness: 26 + tier * 4,
      startAngle: -Math.PI * 0.16,
      endAngle: Math.PI * 0.16,
      angularSpeed: 0.86 + tier * 0.22,
      segments: 16,
    }),
  ];
}

function block(
  stageNumber: number,
  suffix: string,
  kind: ObstacleDefinition['kind'],
  x: number,
  y: number,
  width: number,
  height: number,
  amplitude: number,
  speed: number,
  phase: number,
  extra: Partial<ObstacleDefinition> = {},
): ObstacleDefinition {
  return {
    id: `s${stageNumber}-${suffix}`,
    kind,
    x,
    y,
    width,
    height,
    amplitude,
    speed,
    phase,
    ...extra,
  };
}
