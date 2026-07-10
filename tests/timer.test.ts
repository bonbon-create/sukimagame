import { describe, expect, it } from 'vitest';
import { TimerSystem } from '../src/game/systems/TimerSystem';

describe('TimerSystem', () => {
  it('decreases by elapsed milliseconds', () => {
    const timer = new TimerSystem(60);
    timer.tick(1500);
    expect(timer.remaining).toBeCloseTo(58.5);
  });

  it('does not decrease while paused', () => {
    const timer = new TimerSystem(60);
    timer.tick(1500, true);
    expect(timer.remaining).toBe(60);
  });

  it('adds one-shot bonus time', () => {
    const timer = new TimerSystem(20);
    timer.add(1);
    expect(timer.remaining).toBe(21);
  });
});
