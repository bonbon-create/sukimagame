import { LASER_Y, PLAYER_X, TARGET_X } from '../constants';
import { isLaserPathClear } from '../geometry/collision';
import { createObstacleCollisionShapes } from '../obstacles/obstacleGeometry';
import type { StageDefinition } from '../types/game';

export type SolvabilityResult = {
  solvable: boolean;
  firstClearTime: number | null;
  clearSamples: number;
};

export function simulateStageSolvability(
  stage: StageDefinition,
  durationSeconds = 8,
  sampleStepSeconds = 1 / 60,
): SolvabilityResult {
  const start = { x: PLAYER_X + 40, y: LASER_Y };
  const end = { x: TARGET_X, y: LASER_Y };
  let firstClearTime: number | null = null;
  let clearSamples = 0;

  for (let time = 0; time <= durationSeconds; time += sampleStepSeconds) {
    const shapes = stage.obstacles.flatMap((obstacle) => createObstacleCollisionShapes(obstacle, time));
    if (isLaserPathClear(start, end, shapes)) {
      firstClearTime ??= time;
      clearSamples += 1;
    }
  }

  return {
    solvable: firstClearTime !== null,
    firstClearTime,
    clearSamples,
  };
}
