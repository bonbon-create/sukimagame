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
  const speed = 1.35 + tier * 0.22;
  const amp = 116 - tier * 8;
  const height = 82 + tier * 8;
  return [
    block(stageNumber, 'a', 'verticalBlock', 414, LASER_Y, 50, height, amp, speed, Math.PI / 2),
    block(stageNumber, 'b', 'verticalBlock', 536, LASER_Y, 50, height, amp, speed, -Math.PI / 2),
  ];
}

function verticalFourBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const speed = 1.58 + tier * 0.24;
  const amp = 116 - tier * 7;
  const height = 82 + tier * 8;
  return [342, 444, 546, 648].map((x, index) =>
    block(stageNumber, `${index}`, 'verticalBlock', x, LASER_Y, 42, height, amp, speed, index % 2 === 0 ? Math.PI / 2 : -Math.PI / 2),
  );
}

function shutterColumns(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'shutter', 'shutterGate', 500, LASER_Y, 54 - tier * 4, 90 + tier * 8, 132 - tier * 12, 1.42 + tier * 0.2, Math.PI / 2, {
      count: 3 + tier,
      gap: 50 - tier * 6,
      spread: 118 - tier * 6,
    }),
  ];
}

function phasedBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const phases = [Math.PI / 2, -Math.PI / 2, Math.PI / 3, -Math.PI / 3, Math.PI * 0.62];
  return [320, 414, 508, 602, 696].slice(0, 4 + tier).map((x, index) =>
    block(stageNumber, `${index}`, 'verticalBlock', x, LASER_Y, 40, 76 + tier * 8, 118 - tier * 7, 1.55 + tier * 0.28, phases[index]),
  );
}

function mixedSquaresAndBars(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'square-a', 'verticalBlock', 358, LASER_Y, 58, 58, 112 - tier * 6, 1.65 + tier * 0.22, Math.PI / 2),
    block(stageNumber, 'bar-a', 'verticalBlock', 476, LASER_Y, 44, 116 + tier * 10, 122 - tier * 7, 1.72 + tier * 0.25, -Math.PI / 2),
    block(stageNumber, 'square-b', 'horizontalBlock', 590, 158, 62, 62, 48 + tier * 8, 1.4 + tier * 0.18, Math.PI / 2),
    block(stageNumber, 'bar-b', 'verticalBlock', 676, LASER_Y, 40, 108 + tier * 8, 116 - tier * 6, 1.92 + tier * 0.2, Math.PI / 2),
    block(stageNumber, 'pair', 'slidingPair', 590, LASER_Y, 46, 78 + tier * 6, 116 - tier * 10, 1.36 + tier * 0.2, Math.PI / 2, {
      gap: 48 - tier * 4,
    }),
  ];
}

function rotatingSingleBar(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'rot-a', 'rotatingRectangle', 458, LASER_Y, 156 + tier * 12, 28 + tier * 2, 116 - tier * 8, 1.18 + tier * 0.16, Math.PI / 2, {
      angularSpeed: 1.15 + tier * 0.24,
    }),
    block(stageNumber, 'v-a', 'verticalBlock', 624, LASER_Y, 44, 94 + tier * 6, 116 - tier * 8, 1.72 + tier * 0.23, -Math.PI / 2),
  ];
}

function rotatingDiamondGroup(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'group', 'rotatingGroup', 500, LASER_Y, 42 + tier * 2, 42 + tier * 2, 0, 0.82 + tier * 0.22, Math.PI / 4, {
      count: 4 + tier,
      radius: 116 - tier * 8,
      angularSpeed: 0.78 + tier * 0.2,
    }),
  ];
}

function twinArcGates(stageNumber: number, tier: number): ObstacleDefinition[] {
  const speed = 0.72 + tier * 0.16;
  return [
    block(stageNumber, 'arc-l', 'arcGate', 394, LASER_Y, 0, 24 + tier * 2, 0, speed, 0, {
      radius: 86 - tier * 4,
      thickness: 24 + tier * 2,
      startAngle: Math.PI * 0.2,
      endAngle: Math.PI * 0.82,
      angularSpeed: speed,
      segments: 16,
    }),
    block(stageNumber, 'arc-r', 'arcGate', 608, LASER_Y, 0, 24 + tier * 2, 0, -speed, 0, {
      radius: 86 - tier * 4,
      thickness: 24 + tier * 2,
      startAngle: Math.PI * 1.18,
      endAngle: Math.PI * 1.8,
      angularSpeed: -speed,
      segments: 16,
    }),
  ];
}

function centralArcGate(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'arc-big', 'arcGate', 500, LASER_Y, 0, 30 + tier * 3, 0, 0.82 + tier * 0.12, 0, {
      radius: 122 - tier * 7,
      thickness: 30 + tier * 3,
      startAngle: Math.PI * 0.18,
      endAngle: Math.PI * 0.86,
      angularSpeed: 0.72 + tier * 0.15,
      segments: 20,
    }),
    block(stageNumber, 'orbit', 'orbitingBlock', 500, LASER_Y, 42 + tier * 2, 42 + tier * 2, 0, 1.18 + tier * 0.18, Math.PI / 2, {
      radius: 132 - tier * 8,
    }),
  ];
}

function compositeGate(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'v-a', 'verticalBlock', 346, LASER_Y, 40, 92 + tier * 6, 114 - tier * 7, 1.65 + tier * 0.18, Math.PI / 2),
    block(stageNumber, 'rot', 'rotatingRectangle', 502, LASER_Y, 138 + tier * 10, 28 + tier * 2, 120 - tier * 9, 1.2 + tier * 0.14, -Math.PI / 2, {
      angularSpeed: -1.05 - tier * 0.18,
    }),
    block(stageNumber, 'arc', 'arcGate', 642, LASER_Y, 0, 24 + tier * 3, 0, 0.86 + tier * 0.16, 0, {
      radius: 82 - tier * 4,
      thickness: 24 + tier * 3,
      startAngle: Math.PI * 0.18,
      endAngle: Math.PI * 0.78,
      angularSpeed: 0.86 + tier * 0.16,
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
