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
    obstacles: [...patternBuilders[patternIndex](stageNumber, tier), ...difficultyGates(stageNumber, tier, patternIndex)],
  };
});

export const MVP_STAGES = STAGES.slice(0, 3);

function verticalTwoBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const speed = 1.35 + tier * 0.3;
  const amp = 128 - tier * 14;
  const height = 74 + tier * 16;
  return [
    block(stageNumber, 'a', 'verticalBlock', 414, LASER_Y, 50 + tier * 4, height, amp, speed, 0, { colorVariant: tier >= 2 ? 'red' : 'cyan' }),
    block(stageNumber, 'b', 'verticalBlock', 536, LASER_Y, 50 + tier * 4, height, amp, speed, Math.PI, { colorVariant: tier >= 1 ? 'magenta' : 'cyan' }),
    ...sideBlockers(stageNumber, tier, [330, 620]),
  ];
}

function verticalFourBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const speed = 1.58 + tier * 0.3;
  const amp = 132 - tier * 8;
  const height = 68 + tier * 12;
  const phases = [0, Math.PI, 0.42, Math.PI + 0.42];
  return [342, 444, 546, 648].map((x, index) =>
    block(stageNumber, `${index}`, 'verticalBlock', x, LASER_Y, 42 + tier * 3, height, amp, speed + index * 0.08, phases[index], {
      colorVariant: index >= 2 && tier >= 1 ? 'magenta' : 'cyan',
    }),
  ).concat(tier >= 1 ? [block(stageNumber, 'red-center', 'verticalBlock', 495, LASER_Y, 38, 64 + tier * 12, 118 - tier * 12, 2.35 + tier * 0.35, Math.PI, { colorVariant: 'red' })] : []);
}

function shutterColumns(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'shutter', 'shutterGate', 500, LASER_Y, 54 - tier * 4, 90 + tier * 9, 124 - tier * 12, 1.42 + tier * 0.26, -Math.PI / 2, {
      count: 3 + tier,
      gap: -38 - tier * 8,
      spread: 118 - tier * 6,
      colorVariant: tier >= 2 ? 'red' : 'cyan',
    }),
    ...(tier >= 1
      ? [
          block(stageNumber, 'arc-hold', 'arcGate', 500, LASER_Y, 0, 20 + tier * 4, 0, 0.82 + tier * 0.2, 0, {
            radius: 92 - tier * 8,
            thickness: 20 + tier * 4,
            startAngle: -Math.PI * 0.16,
            endAngle: Math.PI * 0.16,
            angularSpeed: 0.82 + tier * 0.2,
            colorVariant: 'amber',
            reverseInterval: 0.85,
          }),
        ]
      : []),
  ];
}

function phasedBlocks(stageNumber: number, tier: number): ObstacleDefinition[] {
  const phases = [0, Math.PI, 0.54, Math.PI + 0.54, 1.08];
  return [320, 414, 508, 602, 696].slice(0, 4 + tier).map((x, index) =>
    block(stageNumber, `${index}`, 'verticalBlock', x, LASER_Y, 40 + tier * 3, 70 + tier * 12, 132 - tier * 8, 1.55 + tier * 0.32 + index * 0.06, phases[index], {
      colorVariant: index === 4 || (tier >= 2 && index >= 2) ? 'red' : index >= 2 ? 'magenta' : 'cyan',
    }),
  );
}

function mixedSquaresAndBars(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'square-a', 'verticalBlock', 358, LASER_Y, 58 + tier * 3, 58 + tier * 8, 124 - tier * 12, 1.65 + tier * 0.28, 0, { colorVariant: 'cyan' }),
    block(stageNumber, 'bar-a', 'verticalBlock', 476, LASER_Y, 44 + tier * 3, 104 + tier * 16, 126 - tier * 12, 1.72 + tier * 0.3, Math.PI, { colorVariant: tier >= 2 ? 'red' : 'magenta' }),
    block(stageNumber, 'square-b', 'horizontalBlock', 590, 158, 62, 62, 48 + tier * 8, 1.4 + tier * 0.18, Math.PI / 2, { colorVariant: 'cyan' }),
    block(stageNumber, 'bar-b', 'verticalBlock', 676, LASER_Y, 40 + tier * 2, 102 + tier * 14, 120 - tier * 10, 1.92 + tier * 0.24, 0.48, { colorVariant: 'magenta' }),
    block(stageNumber, 'pair', 'slidingPair', 590, LASER_Y, 46, 78 + tier * 8, 112 - tier * 12, 1.36 + tier * 0.24, -Math.PI / 2, {
      gap: -28 - tier * 8,
      colorVariant: tier >= 1 ? 'red' : 'cyan',
    }),
  ];
}

function rotatingSingleBar(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'rot-a', 'rotatingRectangle', 458, LASER_Y, 156 + tier * 16, 30 + tier * 4, 118 - tier * 12, 1.18 + tier * 0.2, 0, {
      angularSpeed: 1.15 + tier * 0.3,
      colorVariant: tier >= 1 ? 'amber' : 'cyan',
      reverseInterval: tier >= 1 ? 0.9 : undefined,
    }),
    block(stageNumber, 'v-a', 'verticalBlock', 624, LASER_Y, 44 + tier * 3, 86 + tier * 15, 122 - tier * 12, 1.72 + tier * 0.27, Math.PI, { colorVariant: tier >= 2 ? 'red' : 'magenta' }),
    ...sideBlockers(stageNumber, tier, [338, 704]),
  ];
}

function rotatingDiamondGroup(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'group', 'rotatingGroup', 500, LASER_Y, 44 + tier * 4, 44 + tier * 4, 0, 0.82 + tier * 0.28, 0, {
      count: 4,
      radius: 112 - tier * 10,
      angularSpeed: 0.78 + tier * 0.26,
      colorVariant: tier >= 1 ? 'amber' : 'cyan',
      reverseInterval: tier >= 2 ? 0.75 : undefined,
    }),
    ...(tier >= 1
      ? [
          block(stageNumber, 'lane-a', 'verticalBlock', 346, LASER_Y, 34, 76 + tier * 10, 118 - tier * 12, 1.65 + tier * 0.22, 0, { colorVariant: 'magenta' }),
          block(stageNumber, 'lane-b', 'verticalBlock', 654, LASER_Y, 34, 76 + tier * 10, 118 - tier * 12, 1.65 + tier * 0.22, Math.PI, { colorVariant: 'magenta' }),
        ]
      : []),
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
      colorVariant: 'cyan',
      reverseInterval: tier >= 2 ? 0.9 : undefined,
    }),
    block(stageNumber, 'arc-r', 'arcGate', 608, LASER_Y, 0, 24 + tier * 2, 0, -speed, 0, {
      radius: 88 - tier * 5,
      thickness: 26 + tier * 4,
      startAngle: Math.PI * 0.82,
      endAngle: Math.PI * 1.18,
      angularSpeed: -speed,
      segments: 16,
      colorVariant: tier >= 1 ? 'magenta' : 'cyan',
      reverseInterval: tier >= 2 ? 0.9 : undefined,
    }),
    ...sideBlockers(stageNumber, tier, [500]),
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
      colorVariant: tier >= 1 ? 'amber' : 'cyan',
      reverseInterval: tier >= 1 ? 1.05 : undefined,
    }),
    block(stageNumber, 'orbit', 'orbitingBlock', 500, LASER_Y, 42 + tier * 4, 42 + tier * 4, 0, 1.18 + tier * 0.24, 0, {
      radius: 132 - tier * 10,
      colorVariant: tier >= 2 ? 'red' : 'magenta',
      reverseInterval: tier >= 2 ? 0.7 : undefined,
    }),
    ...sideBlockers(stageNumber, tier, [360, 640]),
  ];
}

function compositeGate(stageNumber: number, tier: number): ObstacleDefinition[] {
  return [
    block(stageNumber, 'v-a', 'verticalBlock', 346, LASER_Y, 40 + tier * 3, 88 + tier * 16, 124 - tier * 13, 1.65 + tier * 0.24, 0, { colorVariant: 'cyan' }),
    block(stageNumber, 'rot', 'rotatingRectangle', 502, LASER_Y, 138 + tier * 16, 30 + tier * 4, 122 - tier * 12, 1.2 + tier * 0.2, Math.PI, {
      angularSpeed: -1.05 - tier * 0.26,
      colorVariant: 'amber',
      reverseInterval: 0.8,
    }),
    block(stageNumber, 'arc', 'arcGate', 642, LASER_Y, 0, 24 + tier * 3, 0, 0.86 + tier * 0.16, 0, {
      radius: 84 - tier * 5,
      thickness: 26 + tier * 4,
      startAngle: -Math.PI * 0.16,
      endAngle: Math.PI * 0.16,
      angularSpeed: 0.86 + tier * 0.22,
      segments: 16,
      colorVariant: tier >= 1 ? 'magenta' : 'cyan',
      reverseInterval: tier >= 2 ? 0.7 : undefined,
    }),
    ...(tier >= 1
      ? [
          block(stageNumber, 'red-a', 'horizontalBlock', 410, LASER_Y - 112, 66, 34, 58, 2.25 + tier * 0.28, Math.PI / 2, { colorVariant: 'red' }),
          block(stageNumber, 'red-b', 'horizontalBlock', 590, LASER_Y + 112, 66, 34, 58, 2.25 + tier * 0.28, -Math.PI / 2, { colorVariant: 'red' }),
        ]
      : []),
  ];
}

function sideBlockers(stageNumber: number, tier: number, xs: number[]): ObstacleDefinition[] {
  if (tier === 0) {
    return [];
  }

  return xs.flatMap((x, index) => [
    block(stageNumber, `side-${index}-top`, 'verticalBlock', x, LASER_Y - 104, 50 + tier * 3, 44 + tier * 5, 32 + tier * 10, 1.1 + tier * 0.14, index, {
      colorVariant: 'cyan',
    }),
    block(stageNumber, `side-${index}-bottom`, 'verticalBlock', x, LASER_Y + 104, 50 + tier * 3, 44 + tier * 5, 32 + tier * 10, 1.1 + tier * 0.14, index + Math.PI, {
      colorVariant: tier >= 2 ? 'red' : 'magenta',
    }),
  ]);
}

function difficultyGates(stageNumber: number, tier: number, patternIndex: number): ObstacleDefinition[] {
  const patternOffset = patternIndex * 0.11;

  if (tier === 0) {
    const earlyRank = stageNumber - 1;
    return [
      block(stageNumber, 'timing-gate', 'slidingPair', 500, LASER_Y, 44, 52, 136, 1.28 + earlyRank * 0.055, -Math.PI / 2 + patternOffset * 0.7, {
        gap: -54 - earlyRank * 3.2,
        colorVariant: patternIndex >= 5 ? 'magenta' : 'cyan',
      }),
    ];
  }

  if (tier === 1) {
    const midRank = stageNumber - 11;
    const gap = -72 - midRank * 2.6 - (patternIndex >= 7 ? 12 : 0);
    const speed = 1.58 + midRank * 0.05;
    const phaseStep = 0.12 + midRank * 0.012;
    return [
      block(stageNumber, 'timing-gate-a', 'slidingPair', 438, LASER_Y, 42, 58, 132, speed, -Math.PI / 2 + patternOffset * 0.55, {
        gap,
        colorVariant: 'magenta',
      }),
      block(stageNumber, 'timing-gate-b', 'slidingPair', 582, LASER_Y, 42, 58, 132, speed, -Math.PI / 2 + patternOffset * 0.55 + phaseStep, {
        gap,
        colorVariant: patternIndex >= 5 ? 'red' : 'cyan',
      }),
    ];
  }

  const lateRank = stageNumber - 21;
  const usesThreeGates = lateRank >= 6;
  const gap = -88 - lateRank * 2.6 + (patternIndex === 1 ? 10 : 0) + (patternIndex === 0 || patternIndex === 8 ? -4 : 0);
  const speed = 1.94 + lateRank * 0.055;
  const phaseStep = usesThreeGates ? 0.11 + lateRank * 0.006 : 0.1;

  const gates = [
    block(stageNumber, 'timing-gate-a', 'slidingPair', usesThreeGates ? 392 : 438, LASER_Y, 40, 62, 136, speed, -Math.PI / 2 + patternOffset * 0.45, {
      gap,
      colorVariant: 'red',
    }),
    block(stageNumber, 'timing-gate-b', 'slidingPair', usesThreeGates ? 520 : 582, LASER_Y, 40, 62, 136, speed, -Math.PI / 2 + patternOffset * 0.45 + phaseStep, {
      gap,
      colorVariant: 'amber',
    }),
  ];

  if (usesThreeGates) {
    gates.push(
      block(stageNumber, 'timing-gate-c', 'slidingPair', 648, LASER_Y, 40, 62, 136, speed, -Math.PI / 2 + patternOffset * 0.45 + phaseStep * 2, {
        gap,
        colorVariant: 'red',
      }),
    );
  }

  return gates;
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
