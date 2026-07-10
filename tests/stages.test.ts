import { describe, expect, it } from 'vitest';
import { STAGES } from '../src/game/data/stages';
import { isStageClearAt, simulateStageSolvability } from '../src/game/systems/StageSolvability';
import { effectiveAngle } from '../src/game/obstacles/obstacleGeometry';

describe('stage data', () => {
  it('defines 30 original stages', () => {
    expect(STAGES).toHaveLength(30);
    expect(STAGES.map((stage) => stage.displayNumber)).toEqual(Array.from({ length: 30 }, (_, index) => index + 1));
  });

  it('uses all requested obstacle families in the stage set', () => {
    const kinds = new Set(STAGES.flatMap((stage) => stage.obstacles.map((obstacle) => obstacle.kind)));

    expect(kinds).toEqual(
      new Set([
        'verticalBlock',
        'horizontalBlock',
        'slidingPair',
        'shutterGate',
        'rotatingRectangle',
        'rotatingGroup',
        'orbitingBlock',
        'arcGate',
      ]),
    );
  });

  it('has at least one clear timing window for every stage', () => {
    const blockedStages = STAGES.map((stage) => ({
      stage: stage.displayNumber,
      result: simulateStageSolvability(stage),
    })).filter(({ result }) => !result.solvable);

    expect(blockedStages).toEqual([]);
  });

  it('does not allow clearing immediately after a stage loads', () => {
    const initiallyClearStages = STAGES.filter((stage) => isStageClearAt(stage, 0)).map((stage) => stage.displayNumber);

    expect(initiallyClearStages).toEqual([]);
  });

  it('narrows average clear opportunities in later tiers', () => {
    const tierAverages = [0, 1, 2].map((tier) => {
      const stages = STAGES.slice(tier * 10, tier * 10 + 10);
      const totalClearSamples = stages.reduce((total, stage) => total + simulateStageSolvability(stage).clearSamples, 0);
      return totalClearSamples / stages.length;
    });

    expect(tierAverages[1]).toBeLessThan(tierAverages[0]);
    expect(tierAverages[2]).toBeLessThan(tierAverages[1]);
  });

  it('opens at least one gap within the first 3 seconds', () => {
    const slowOpeningStages = STAGES.map((stage) => ({
      stage: stage.displayNumber,
      result: simulateStageSolvability(stage, 3),
    })).filter(({ result }) => !result.solvable || result.firstClearTime === null || result.firstClearTime > 3);

    expect(slowOpeningStages).toEqual([]);
  });

  it('uses gap count and window length to keep a gradual difficulty curve', () => {
    const outOfCurveStages = STAGES.map((stage) => {
      const profile = difficultyProfile(stage.displayNumber);
      const result = simulateStageSolvability(stage);
      return {
        stage: stage.displayNumber,
        clearWindowCount: result.clearWindowCount,
        clearSamples: result.clearSamples,
        longestClearRun: result.longestClearRun,
        profile,
      };
    }).filter(({ clearWindowCount, clearSamples, longestClearRun, profile }) => {
      return (
        clearWindowCount < profile.minWindows ||
        clearWindowCount > profile.maxWindows ||
        clearSamples < profile.minSamples ||
        clearSamples > profile.maxSamples ||
        longestClearRun > profile.maxRun
      );
    });

    expect(outOfCurveStages).toEqual([]);
  });

  it('supports reversible rotating obstacles', () => {
    const definition = {
      id: 'reverse-test',
      kind: 'rotatingRectangle' as const,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      amplitude: 0,
      speed: 1,
      phase: 0,
      reverseInterval: 1,
    };

    expect(effectiveAngle(definition, 0.5, 2)).toBeCloseTo(1);
    expect(effectiveAngle(definition, 1.5, 2)).toBeCloseTo(1);
    expect(effectiveAngle(definition, 2, 2)).toBeCloseTo(0);
  });
});

function difficultyProfile(stageNumber: number): {
  minWindows: number;
  maxWindows: number;
  minSamples: number;
  maxSamples: number;
  maxRun: number;
} {
  if (stageNumber <= 5) {
    return { minWindows: 2, maxWindows: 7, minSamples: 100, maxSamples: 300, maxRun: 155 };
  }
  if (stageNumber <= 10) {
    return { minWindows: 2, maxWindows: 7, minSamples: 85, maxSamples: 230, maxRun: 125 };
  }
  if (stageNumber <= 15) {
    return { minWindows: 1, maxWindows: 6, minSamples: 35, maxSamples: 180, maxRun: 95 };
  }
  if (stageNumber <= 20) {
    return { minWindows: 1, maxWindows: 6, minSamples: 40, maxSamples: 150, maxRun: 78 };
  }
  if (stageNumber <= 25) {
    return { minWindows: 1, maxWindows: 5, minSamples: 24, maxSamples: 120, maxRun: 64 };
  }
  return { minWindows: 1, maxWindows: 5, minSamples: 12, maxSamples: 112, maxRun: 52 };
}
