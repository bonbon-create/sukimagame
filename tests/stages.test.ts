import { describe, expect, it } from 'vitest';
import { STAGES } from '../src/game/data/stages';
import { isStageClearAt, simulateStageSolvability } from '../src/game/systems/StageSolvability';

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
});
