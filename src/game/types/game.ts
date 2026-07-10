export type Vector2 = {
  x: number;
  y: number;
};

export type AABB = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OBB = {
  center: Vector2;
  width: number;
  height: number;
  rotation: number;
};

export type Polygon = {
  points: Vector2[];
};

export type CollisionShape =
  | { type: 'aabb'; box: AABB }
  | { type: 'obb'; box: OBB }
  | { type: 'polygon'; polygon: Polygon };

export type MovementType = 'vertical' | 'horizontal' | 'static';

export type ObstacleDefinition = {
  id: string;
  kind: 'verticalBlock' | 'staticBlock';
  x: number;
  y: number;
  width: number;
  height: number;
  amplitude: number;
  speed: number;
  phase: number;
};

export type StageDefinition = {
  id: string;
  displayNumber: number;
  difficulty: number;
  backgroundVariant: 'cyan' | 'magenta' | 'amber';
  targetVariant: 'hex-core';
  transitionDuration: number;
  obstacles: ObstacleDefinition[];
};

export type ShotResult = {
  clear: boolean;
  firstShot: boolean;
  shotsInStage: number;
};

export type ResultPayload = {
  cleared: boolean;
  reachedStage: number;
  remainingTime: number;
  oneShotCount: number;
  shotCount: number;
};
