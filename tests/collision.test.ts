import { describe, expect, it } from 'vitest';
import { isLaserPathClear, normalizeAngle, rayIntersectsAABB, rayIntersectsOBB } from '../src/game/geometry/collision';

describe('collision geometry', () => {
  it('detects an AABB crossing the laser segment', () => {
    expect(rayIntersectsAABB({ x: 0, y: 10 }, { x: 100, y: 10 }, { x: 45, y: 5, width: 10, height: 20 })).toBe(true);
  });

  it('allows a clear gap', () => {
    expect(
      isLaserPathClear({ x: 0, y: 10 }, { x: 100, y: 10 }, [{ type: 'aabb', box: { x: 45, y: 30, width: 10, height: 20 } }]),
    ).toBe(true);
  });

  it('detects rotated rectangle intersections', () => {
    expect(
      rayIntersectsOBB(
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { center: { x: 50, y: 0 }, width: 20, height: 60, rotation: Math.PI / 4 },
      ),
    ).toBe(true);
  });

  it('normalizes angles into a stable range', () => {
    expect(normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI);
  });
});
