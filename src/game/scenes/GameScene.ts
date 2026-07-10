import Phaser from 'phaser';
import {
  LASER_Y,
  PLAYER_X,
  REFIRE_COOLDOWN_MS,
  START_TIME_SECONDS,
  TARGET_X,
  WARNING_TIME_SECONDS,
} from '../constants';
import { MVP_STAGES } from '../data/stages';
import { Laser } from '../entities/Laser';
import { Player } from '../entities/Player';
import { TargetCore } from '../entities/TargetCore';
import { VerticalOscillator } from '../obstacles/VerticalOscillator';
import { evaluateLaserShot } from '../systems/CollisionSystem';
import { StageSystem } from '../systems/StageSystem';
import { TimerSystem } from '../systems/TimerSystem';
import { ProgressBar } from '../ui/ProgressBar';
import type { BaseObstacle } from '../obstacles/BaseObstacle';
import type { ResultPayload, StageDefinition } from '../types/game';

export class GameScene extends Phaser.Scene {
  private timer!: TimerSystem;
  private stageSystem!: StageSystem;
  private progress!: ProgressBar;
  private player!: Player;
  private target!: TargetCore;
  private obstacles: BaseObstacle[] = [];
  private timerText!: Phaser.GameObjects.Text;
  private stageText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private elapsedSeconds = 0;
  private locked = false;
  private cooldownUntil = 0;
  private shotCount = 0;
  private oneShotCount = 0;
  private clearedStages = 0;

  public constructor() {
    super('GameScene');
  }

  public create(): void {
    this.timer = new TimerSystem(START_TIME_SECONDS);
    this.stageSystem = new StageSystem(MVP_STAGES);
    this.elapsedSeconds = 0;
    this.locked = false;
    this.cooldownUntil = 0;
    this.shotCount = 0;
    this.oneShotCount = 0;
    this.clearedStages = 0;

    this.drawBackground(false);
    this.progress = new ProgressBar(this, this.stageSystem.totalStages);
    this.timerText = this.add.text(480, 48, '', {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '34px',
      color: '#f7fbff',
    }).setOrigin(0.5);
    this.stageText = this.add.text(80, 44, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#42f8ff',
    }).setOrigin(0, 0.5);
    this.statusText = this.add.text(480, 478, 'スキマを狙ってタップ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      color: '#f7fbff',
    }).setOrigin(0.5);

    this.player = new Player(this);
    this.target = new TargetCore(this);
    this.loadStage(this.stageSystem.currentStage);

    this.input.on('pointerdown', () => this.tryFire());
    this.input.keyboard?.on('keydown-SPACE', () => this.tryFire());
    this.updateHud();
  }

  public override update(_time: number, delta: number): void {
    this.elapsedSeconds += delta / 1000;
    this.timer.tick(delta);
    this.obstacles.forEach((obstacle) => obstacle.update(this.elapsedSeconds));
    this.player.render(this.time.now);
    this.updateHud();

    if (this.timer.expired && !this.locked) {
      this.endGame(false);
    }
  }

  private tryFire(): void {
    if (this.locked || this.time.now < this.cooldownUntil || this.timer.expired) {
      return;
    }

    this.shotCount += 1;
    const start = { x: PLAYER_X + 40, y: LASER_Y };
    const end = { x: TARGET_X, y: LASER_Y };
    const clear = evaluateLaserShot(start, end, this.obstacles);
    const shotResult = this.stageSystem.recordShot(clear);

    Laser.fire(this, clear);

    if (!clear) {
      this.cameras.main.shake(90, 0.006);
      this.cooldownUntil = this.time.now + REFIRE_COOLDOWN_MS;
      this.player.setCooldown(this.time.now, REFIRE_COOLDOWN_MS);
      this.statusText.setText('ブロックされた');
      this.statusText.setColor('#ff5b5b');
      return;
    }

    this.locked = true;
    this.clearedStages += 1;
    this.target.hitFlash();
    this.player.runForward();
    this.cameras.main.shake(120, 0.004);
    this.obstacles.forEach((obstacle) => obstacle.destroyAnimation());

    if (shotResult.firstShot) {
      this.oneShotCount += 1;
      this.timer.add(this.stageSystem.getOneShotBonus(true));
      this.showFloatingText('1 SHOT  +1.0 SEC', '#42f8ff');
    } else {
      this.showFloatingText('BREAKTHROUGH', '#f7fbff');
    }

    this.time.delayedCall(this.stageSystem.currentStage.transitionDuration, () => {
      const completed = this.stageSystem.advance();
      if (completed) {
        this.endGame(true);
        return;
      }
      this.locked = false;
      this.loadStage(this.stageSystem.currentStage);
    });
  }

  private loadStage(stage: StageDefinition): void {
    this.obstacles.forEach((obstacle) => obstacle.destroy());
    this.obstacles = stage.obstacles.map((definition) => new VerticalOscillator(this, definition));
    this.elapsedSeconds = 0;
    this.statusText.setText('スキマを狙ってタップ');
    this.statusText.setColor('#f7fbff');
    this.drawBackground(this.timer.remaining <= WARNING_TIME_SECONDS);
    this.updateHud();
  }

  private updateHud(): void {
    const warning = this.timer.remaining <= WARNING_TIME_SECONDS;
    this.timerText.setText(`TIME ${this.timer.remaining.toFixed(1)}`);
    this.timerText.setColor(warning ? '#ff5b5b' : '#f7fbff');
    this.stageText.setText(`STAGE ${Math.min(this.stageSystem.currentStageNumber, this.stageSystem.totalStages)}`);
    this.progress.render(Math.min(this.clearedStages, this.stageSystem.totalStages - 1));
  }

  private drawBackground(warning: boolean): void {
    const graphics = this.add.graphics();
    graphics.setDepth(-10);
    graphics.fillStyle(warning ? 0x16070b : 0x050712, 1);
    graphics.fillRect(0, 0, 960, 540);
    graphics.lineStyle(1, warning ? 0x5d1e2d : 0x172642, 0.5);
    for (let x = -50; x < 1040; x += 52) {
      for (let y = -30; y < 600; y += 45) {
        graphics.strokeCircle(x + ((y / 45) % 2) * 26, y, 18);
      }
    }
    graphics.lineStyle(2, 0x42f8ff, 0.28);
    graphics.lineBetween(PLAYER_X, LASER_Y, TARGET_X, LASER_Y);
    if (warning) {
      graphics.lineStyle(6, 0xff253f, 0.8);
      graphics.strokeRect(6, 6, 948, 528);
    }
  }

  private showFloatingText(label: string, color: string): void {
    const text = this.add.text(480, 205, label, {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '28px',
      color,
    }).setOrigin(0.5);
    this.tweens.add({
      targets: text,
      y: 172,
      alpha: 0,
      duration: 650,
      onComplete: () => text.destroy(),
    });
  }

  private endGame(cleared: boolean): void {
    this.locked = true;
    const payload: ResultPayload = {
      cleared,
      reachedStage: cleared ? this.stageSystem.totalStages : this.clearedStages + 1,
      remainingTime: this.timer.remaining,
      oneShotCount: this.oneShotCount,
      shotCount: this.shotCount,
    };
    this.scene.start('ResultScene', payload);
  }
}
