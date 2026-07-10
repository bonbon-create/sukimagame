import { isLaserPathClear } from '../geometry/collision';
import type { BaseObstacle } from '../obstacles/BaseObstacle';
import type { Vector2 } from '../types/game';

export function evaluateLaserShot(start: Vector2, end: Vector2, obstacles: BaseObstacle[]): boolean {
  return isLaserPathClear(
    start,
    end,
    obstacles.flatMap((obstacle) => obstacle.getCollisionShapes()),
  );
}
