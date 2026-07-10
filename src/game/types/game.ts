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

export type MovementType =
  | 'vertical'
  | 'horizontal'
  | 'slidingPair'
  | 'rotating'
  | 'rotatingGroup'
  | 'orbit'
  | 'arc'
  | 'shutter'
  | 'static';

export type ObstacleKind =
  | 'verticalBlock'
  | 'horizontalBlock'
  | 'slidingPair'
  | 'rotatingRectangle'
  | 'rotatingGroup'
  | 'orbitingBlock'
  | 'arcGate'
  | 'shutterGate'
  | 'staticBlock';

export type ObstacleDefinition = {
  id: string;
  kind: ObstacleKind;
  x: number;
  y: number;
  width: number;
  height: number;
  amplitude: number;
  speed: number;
  phase: number;
  rotation?: number;
  angularSpeed?: number;
  radius?: number;
  thickness?: number;
  startAngle?: number;
  endAngle?: number;
  segments?: number;
  count?: number;
  gap?: number;
  spread?: number;
};

export type StageDefinition = {
  id: string;
  displayNumber: number;
  difficulty: number;
  backgroundVariant: 'cyan' | 'magenta' | 'amber';
  targetVariant: 'hex-core';
  warningThreshold?: number;
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
