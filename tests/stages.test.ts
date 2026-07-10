import { describe, expect, it } from 'vitest';
import { STAGES } from '../src/game/data/stages';
import { simulateStageSolvability } from '../src/game/systems/StageSolvability';

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
});
