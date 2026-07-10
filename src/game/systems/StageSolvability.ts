import { LASER_Y, PLAYER_X, TARGET_X } from '../constants';
import { isLaserPathClear } from '../geometry/collision';
import { createObstacleCollisionShapes } from '../obstacles/obstacleGeometry';
import type { StageDefinition } from '../types/game';

export type SolvabilityResult = {
  solvable: boolean;
  firstClearTime: number | null;
  clearWindowCount: number;
  clearSamples: number;
  longestClearRun: number;
  totalSamples: number;
};

export function simulateStageSolvability(
  stage: StageDefinition,
  durationSeconds = 8,
  sampleStepSeconds = 1 / 60,
): SolvabilityResult {
  const start = { x: PLAYER_X + 40, y: LASER_Y };
  const end = { x: TARGET_X, y: LASER_Y };
  let firstClearTime: number | null = null;
  let clearWindowCount = 0;
  let clearSamples = 0;
  let currentRun = 0;
  let longestClearRun = 0;
  let totalSamples = 0;
  let previousClear = false;

  for (let time = 0; time <= durationSeconds; time += sampleStepSeconds) {
    totalSamples += 1;
    const shapes = stage.obstacles.flatMap((obstacle) => createObstacleCollisionShapes(obstacle, time));
    const clear = isLaserPathClear(start, end, shapes);
    if (clear) {
      firstClearTime ??= time;
      if (!previousClear) {
        clearWindowCount += 1;
      }
      clearSamples += 1;
      currentRun += 1;
      longestClearRun = Math.max(longestClearRun, currentRun);
    } else {
      currentRun = 0;
    }
    previousClear = clear;
  }

  return {
    solvable: firstClearTime !== null,
    firstClearTime,
    clearWindowCount,
    clearSamples,
    longestClearRun,
    totalSamples,
  };
}

export function isStageClearAt(stage: StageDefinition, elapsedSeconds: number): boolean {
  const start = { x: PLAYER_X + 40, y: LASER_Y };
  const end = { x: TARGET_X, y: LASER_Y };
  const shapes = stage.obstacles.flatMap((obstacle) => createObstacleCollisionShapes(obstacle, elapsedSeconds));
  return isLaserPathClear(start, end, shapes);
}
