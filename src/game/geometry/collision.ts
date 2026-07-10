import type { AABB, CollisionShape, OBB, Polygon, Vector2 } from '../types/game';

const EPSILON = 0.000001;

export function normalizeAngle(angle: number): number {
  let normalized = ((angle + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (normalized <= -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

export function rayIntersectsAABB(start: Vector2, end: Vector2, box: AABB): boolean {
  const minX = box.x;
  const maxX = box.x + box.width;
  const minY = box.y;
  const maxY = box.y + box.height;
  const direction = { x: end.x - start.x, y: end.y - start.y };

  let tMin = 0;
  let tMax = 1;

  for (const axis of ['x', 'y'] as const) {
    const origin = start[axis];
    const delta = direction[axis];
    const min = axis === 'x' ? minX : minY;
    const max = axis === 'x' ? maxX : maxY;

    if (Math.abs(delta) < EPSILON) {
      if (origin < min || origin > max) {
        return false;
      }
      continue;
    }

    const invDelta = 1 / delta;
    let t1 = (min - origin) * invDelta;
    let t2 = (max - origin) * invDelta;

    if (t1 > t2) {
      const temp = t1;
      t1 = t2;
      t2 = temp;
    }

    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);

    if (tMin > tMax) {
      return false;
    }
  }

  return true;
}

export function rayIntersectsOBB(start: Vector2, end: Vector2, box: OBB): boolean {
  return segmentIntersectsPolygon(start, end, { points: obbToPolygon(box) });
}

export function segmentIntersectsPolygon(start: Vector2, end: Vector2, polygon: Polygon): boolean {
  if (polygon.points.length < 3) {
    return false;
  }

  if (pointInPolygon(start, polygon.points) || pointInPolygon(end, polygon.points)) {
    return true;
  }

  return polygon.points.some((point, index) => {
    const next = polygon.points[(index + 1) % polygon.points.length];
    return segmentsIntersect(start, end, point, next);
  });
}

export function isLaserPathClear(start: Vector2, end: Vector2, shapes: CollisionShape[]): boolean {
  return !shapes.some((shape) => {
    if (shape.type === 'aabb') {
      return rayIntersectsAABB(start, end, shape.box);
    }
    if (shape.type === 'obb') {
      return rayIntersectsOBB(start, end, shape.box);
    }
    return segmentIntersectsPolygon(start, end, shape.polygon);
  });
}

export function obbToPolygon(box: OBB): Vector2[] {
  const halfW = box.width / 2;
  const halfH = box.height / 2;
  const cos = Math.cos(box.rotation);
  const sin = Math.sin(box.rotation);
  const corners = [
    { x: -halfW, y: -halfH },
    { x: halfW, y: -halfH },
    { x: halfW, y: halfH },
    { x: -halfW, y: halfH },
  ];

  return corners.map((corner) => ({
    x: box.center.x + corner.x * cos - corner.y * sin,
    y: box.center.y + corner.x * sin + corner.y * cos,
  }));
}

function segmentsIntersect(a: Vector2, b: Vector2, c: Vector2, d: Vector2): boolean {
  const orientation1 = orientation(a, b, c);
  const orientation2 = orientation(a, b, d);
  const orientation3 = orientation(c, d, a);
  const orientation4 = orientation(c, d, b);

  if (orientation1 !== orientation2 && orientation3 !== orientation4) {
    return true;
  }

  return (
    (orientation1 === 0 && onSegment(a, c, b)) ||
    (orientation2 === 0 && onSegment(a, d, b)) ||
    (orientation3 === 0 && onSegment(c, a, d)) ||
    (orientation4 === 0 && onSegment(c, b, d))
  );
}

function orientation(a: Vector2, b: Vector2, c: Vector2): -1 | 0 | 1 {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < EPSILON) {
    return 0;
  }
  return value > 0 ? 1 : -1;
}

function onSegment(a: Vector2, b: Vector2, c: Vector2): boolean {
  return (
    b.x <= Math.max(a.x, c.x) + EPSILON &&
    b.x + EPSILON >= Math.min(a.x, c.x) &&
    b.y <= Math.max(a.y, c.y) + EPSILON &&
    b.y + EPSILON >= Math.min(a.y, c.y)
  );
}

function pointInPolygon(point: Vector2, points: Vector2[]): boolean {
  let inside = false;

  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const current = points[index];
    const prior = points[previous];
    const intersects =
      current.y > point.y !== prior.y > point.y &&
      point.x < ((prior.x - current.x) * (point.y - current.y)) / (prior.y - current.y) + current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}
