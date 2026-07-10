import { LASER_Y } from '../constants';
import type { CollisionShape, ObstacleDefinition, Vector2 } from '../types/game';

export function createObstacleCollisionShapes(definition: ObstacleDefinition, elapsedSeconds: number): CollisionShape[] {
  switch (definition.kind) {
    case 'verticalBlock':
      return [aabbFromCenter(definition.x, oscillate(definition.y, definition, elapsedSeconds), definition.width, definition.height)];
    case 'horizontalBlock':
      return [aabbFromCenter(oscillate(definition.x, definition, elapsedSeconds), definition.y, definition.width, definition.height)];
    case 'slidingPair':
      return createSlidingPair(definition, elapsedSeconds);
    case 'rotatingRectangle':
      return [createRotatingRectangle(definition, elapsedSeconds)];
    case 'rotatingGroup':
      return createRotatingGroup(definition, elapsedSeconds);
    case 'orbitingBlock':
      return [createOrbitingBlock(definition, elapsedSeconds)];
    case 'arcGate':
      return createArcGate(definition, elapsedSeconds);
    case 'shutterGate':
      return createShutterGate(definition, elapsedSeconds);
    case 'staticBlock':
      return [aabbFromCenter(definition.x, definition.y, definition.width, definition.height)];
  }
}

export function createArcPolygon(
  center: Vector2,
  radius: number,
  thickness: number,
  startAngle: number,
  endAngle: number,
  segments: number,
): Vector2[] {
  const outer: Vector2[] = [];
  const inner: Vector2[] = [];
  const steps = Math.max(4, segments);

  for (let index = 0; index <= steps; index += 1) {
    const ratio = index / steps;
    const angle = startAngle + (endAngle - startAngle) * ratio;
    outer.push({
      x: center.x + Math.cos(angle) * (radius + thickness / 2),
      y: center.y + Math.sin(angle) * (radius + thickness / 2),
    });
    inner.unshift({
      x: center.x + Math.cos(angle) * (radius - thickness / 2),
      y: center.y + Math.sin(angle) * (radius - thickness / 2),
    });
  }

  return [...outer, ...inner];
}

function createSlidingPair(definition: ObstacleDefinition, elapsedSeconds: number): CollisionShape[] {
  const openOffset = ((Math.sin(elapsedSeconds * definition.speed + definition.phase) + 1) / 2) * definition.amplitude;
  const gap = (definition.gap ?? 72) + openOffset;
  const y = definition.y || LASER_Y;

  return [
    aabbFromCenter(definition.x, y - gap / 2 - definition.height / 2, definition.width, definition.height),
    aabbFromCenter(definition.x, y + gap / 2 + definition.height / 2, definition.width, definition.height),
  ];
}

function createShutterGate(definition: ObstacleDefinition, elapsedSeconds: number): CollisionShape[] {
  const open = (definition.gap ?? 54) + ((Math.sin(elapsedSeconds * definition.speed + definition.phase) + 1) / 2) * definition.amplitude;
  const spread = definition.spread ?? 120;
  const columns = Math.max(2, definition.count ?? 3);
  const startX = definition.x - ((columns - 1) * spread) / 2;

  return Array.from({ length: columns }, (_, index) => {
    const x = startX + index * spread;
    const direction = index % 2 === 0 ? -1 : 1;
    return [
      aabbFromCenter(x, definition.y + direction * (open / 2 + definition.height / 2), definition.width, definition.height),
      aabbFromCenter(x, definition.y - direction * (open / 2 + definition.height / 2), definition.width, definition.height),
    ];
  }).flat();
}

function createRotatingRectangle(definition: ObstacleDefinition, elapsedSeconds: number): CollisionShape {
  const y = definition.y + Math.sin(elapsedSeconds * definition.speed + definition.phase) * definition.amplitude;
  return {
    type: 'obb',
    box: {
      center: { x: definition.x, y },
      width: definition.width,
      height: definition.height,
      rotation: (definition.rotation ?? 0) + elapsedSeconds * (definition.angularSpeed ?? definition.speed) + definition.phase,
    },
  };
}

function createRotatingGroup(definition: ObstacleDefinition, elapsedSeconds: number): CollisionShape[] {
  const count = Math.max(2, definition.count ?? 4);
  const radius = definition.radius ?? 86;
  const rotation = (definition.rotation ?? 0) + elapsedSeconds * (definition.angularSpeed ?? definition.speed) + definition.phase;

  return Array.from({ length: count }, (_, index) => {
    const angle = rotation + (Math.PI * 2 * index) / count;
    return {
      type: 'obb',
      box: {
        center: {
          x: definition.x + Math.cos(angle) * radius,
          y: definition.y + Math.sin(angle) * radius,
        },
        width: definition.width,
        height: definition.height,
        rotation: angle + Math.PI / 4,
      },
    };
  });
}

function createOrbitingBlock(definition: ObstacleDefinition, elapsedSeconds: number): CollisionShape {
  const angle = elapsedSeconds * definition.speed + definition.phase;
  const radius = definition.radius ?? definition.amplitude;
  return {
    type: 'obb',
    box: {
      center: {
        x: definition.x + Math.cos(angle) * radius,
        y: definition.y + Math.sin(angle) * radius,
      },
      width: definition.width,
      height: definition.height,
      rotation: angle + (definition.rotation ?? 0),
    },
  };
}

function createArcGate(definition: ObstacleDefinition, elapsedSeconds: number): CollisionShape[] {
  const count = Math.max(1, definition.count ?? 1);
  const rotation = (definition.rotation ?? 0) + elapsedSeconds * (definition.angularSpeed ?? definition.speed) + definition.phase;
  const arcSize = (definition.endAngle ?? Math.PI * 0.7) - (definition.startAngle ?? 0);
  const radius = definition.radius ?? 92;
  const thickness = definition.thickness ?? definition.height;
  const segments = definition.segments ?? 14;

  return Array.from({ length: count }, (_, index) => {
    const start = rotation + (definition.startAngle ?? 0) + (Math.PI * 2 * index) / count;
    const end = start + arcSize;
    return {
      type: 'polygon',
      polygon: {
        points: createArcPolygon({ x: definition.x, y: definition.y }, radius, thickness, start, end, segments),
      },
    };
  });
}

function aabbFromCenter(x: number, y: number, width: number, height: number): CollisionShape {
  return {
    type: 'aabb',
    box: {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
    },
  };
}

function oscillate(base: number, definition: ObstacleDefinition, elapsedSeconds: number): number {
  return base + Math.sin(elapsedSeconds * definition.speed + definition.phase) * definition.amplitude;
}
