import { describe, expect, it } from 'vitest';
import {
  isLaserPathClear,
  normalizeAngle,
  rayIntersectsAABB,
  rayIntersectsOBB,
  segmentIntersectsPolygon,
} from '../src/game/geometry/collision';
import { createArcPolygon } from '../src/game/obstacles/obstacleGeometry';

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

  it('detects an approximated arc polygon crossing the laser', () => {
    const arc = createArcPolygon({ x: 50, y: 0 }, 32, 14, -0.35, 0.35, 10);

    expect(segmentIntersectsPolygon({ x: 0, y: 0 }, { x: 100, y: 0 }, { points: arc })).toBe(true);
  });
});
