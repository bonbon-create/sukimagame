import { ONE_SHOT_BONUS_SECONDS } from '../constants';
import type { ShotResult, StageDefinition } from '../types/game';

export class StageSystem {
  private currentIndex = 0;
  private stageShotCount = 0;

  public constructor(private readonly stages: StageDefinition[]) {}

  public get currentStage(): StageDefinition {
    return this.stages[this.currentIndex];
  }

  public get currentStageNumber(): number {
    return this.currentIndex + 1;
  }

  public get totalStages(): number {
    return this.stages.length;
  }

  public get completed(): boolean {
    return this.currentIndex >= this.stages.length;
  }

  public recordShot(clear: boolean): ShotResult {
    this.stageShotCount += 1;
    return {
      clear,
      firstShot: clear && this.stageShotCount === 1,
      shotsInStage: this.stageShotCount,
    };
  }

  public advance(): boolean {
    this.currentIndex += 1;
    this.stageShotCount = 0;
    return this.completed;
  }

  public getOneShotBonus(firstShot: boolean): number {
    return firstShot ? ONE_SHOT_BONUS_SECONDS : 0;
  }
}
