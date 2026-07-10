import { describe, expect, it } from 'vitest';
import { sortRecords } from '../src/game/systems/StorageSystem';
import type { RecordEntry } from '../src/game/types/game';

describe('StorageSystem record sorting', () => {
  it('sorts cleared runs by remaining time before failed runs', () => {
    const records = [
      record('failed-late', false, 25, 0, 40),
      record('clear-slow', true, 30, 4.2, 31),
      record('clear-fast', true, 30, 12.4, 30),
      record('failed-early', false, 12, 0, 12),
    ];

    expect(sortRecords(records).map((entry) => entry.id)).toEqual(['clear-fast', 'clear-slow', 'failed-late', 'failed-early']);
  });
});

function record(id: string, cleared: boolean, reachedStage: number, remainingTime: number, shotCount: number): RecordEntry {
  return {
    id,
    cleared,
    reachedStage,
    remainingTime,
    shotCount,
    oneShotCount: 0,
    accuracy: shotCount > 0 ? Math.round((reachedStage / shotCount) * 100) : 0,
    playedAt: `2026-07-10T00:00:0${id.length % 10}.000Z`,
  };
}
