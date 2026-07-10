import { describe, expect, it } from 'vitest';
import { MVP_STAGES, STAGES } from '../src/game/data/stages';
import { StageSystem } from '../src/game/systems/StageSystem';

describe('StageSystem scoring', () => {
  it('awards one-shot only on the first successful shot', () => {
    const stages = new StageSystem(MVP_STAGES);
    const miss = stages.recordShot(false);
    const hit = stages.recordShot(true);

    expect(miss.firstShot).toBe(false);
    expect(hit.firstShot).toBe(false);
    expect(stages.getOneShotBonus(hit.firstShot)).toBe(0);
  });

  it('awards one-shot on immediate success', () => {
    const stages = new StageSystem(MVP_STAGES);
    const hit = stages.recordShot(true);

    expect(hit.firstShot).toBe(true);
    expect(stages.getOneShotBonus(hit.firstShot)).toBe(1);
  });

  it('advances through MVP stages', () => {
    const stages = new StageSystem(MVP_STAGES);

    expect(stages.advance()).toBe(false);
    expect(stages.advance()).toBe(false);
    expect(stages.advance()).toBe(true);
  });

  it('reports completion after all 30 stages', () => {
    const stages = new StageSystem(STAGES);

    for (let index = 0; index < STAGES.length - 1; index += 1) {
      expect(stages.advance()).toBe(false);
    }

    expect(stages.advance()).toBe(true);
  });
});
