import Phaser from 'phaser';
import {
  LASER_Y,
  PLAYER_X,
  REFIRE_COOLDOWN_MS,
  START_TIME_SECONDS,
  TARGET_X,
  WARNING_TIME_SECONDS,
} from '../constants';
import { STAGES } from '../data/stages';
import { Laser } from '../entities/Laser';
import { Player } from '../entities/Player';
import { TargetCore } from '../entities/TargetCore';
import { createObstacle } from '../obstacles/createObstacle';
import { AudioSystem } from '../systems/AudioSystem';
import { evaluateLaserShot } from '../systems/CollisionSystem';
import { EffectsSystem } from '../systems/EffectsSystem';
import { StageSystem } from '../systems/StageSystem';
import { TimerSystem } from '../systems/TimerSystem';
import { PauseOverlay } from '../ui/PauseOverlay';
import { ProgressBar } from '../ui/ProgressBar';
import { UI_COLORS, createNeonButton } from '../ui/theme';
import type { BaseObstacle } from '../obstacles/BaseObstacle';
import type { CollisionShape, ResultPayload, StageDefinition } from '../types/game';

export class GameScene extends Phaser.Scene {
  private timer!: TimerSystem;
  private stageSystem!: StageSystem;
  private progress!: ProgressBar;
  private player!: Player;
  private target!: TargetCore;
  private effects!: EffectsSystem;
  private obstacles: BaseObstacle[] = [];
  private background!: Phaser.GameObjects.Graphics;
  private alarmOverlay!: Phaser.GameObjects.Rectangle;
  private timerText!: Phaser.GameObjects.Text;
  private stageText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private pauseButton!: Phaser.GameObjects.Container;
  private pauseOverlay: PauseOverlay | null = null;
  private elapsedSeconds = 0;
  private locked = false;
  private paused = false;
  private ending = false;
  private cooldownUntil = 0;
  private uiInputBlockedUntil = 0;
  private shotCount = 0;
  private oneShotCount = 0;
  private clearedStages = 0;
  private warningActive = false;
  private nextWarningBeepAt = 0;

  public constructor() {
    super('GameScene');
  }

  public create(): void {
    this.timer = new TimerSystem(START_TIME_SECONDS);
    this.stageSystem = new StageSystem(STAGES);
    this.effects = new EffectsSystem(this);
    this.elapsedSeconds = 0;
    this.locked = false;
    this.paused = false;
    this.ending = false;
    this.cooldownUntil = 0;
    this.shotCount = 0;
    this.oneShotCount = 0;
    this.clearedStages = 0;
    this.warningActive = false;

    this.background = this.add.graphics();
    this.background.setDepth(-10);
    this.drawBackground(false);
    this.alarmOverlay = this.add.rectangle(480, 270, 960, 540, 0xff1f3d, 0).setDepth(-5);
    this.drawHudFrame();

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
    this.pauseButton = createNeonButton(this, 906, 42, 72, 38, 'II', () => this.togglePause(), {
      accent: UI_COLORS.cyan,
      fontSize: 20,
    });

    this.player = new Player(this);
    this.target = new TargetCore(this);
    this.loadStage(this.stageSystem.currentStage);

    this.input.on('pointerdown', () => this.tryFire());
    this.input.keyboard?.on('keydown-SPACE', () => this.tryFire());
    this.input.keyboard?.on('keydown-ESC', () => this.togglePause());
    this.updateHud();
  }

  public override update(time: number, delta: number): void {
    if (this.paused || this.ending) {
      return;
    }

    this.elapsedSeconds += delta / 1000;
    this.timer.tick(delta);
    this.obstacles.forEach((obstacle) => obstacle.update(this.elapsedSeconds));
    this.player.render(this.time.now);
    this.updateHud(time);

    if (this.timer.expired) {
      this.endGame(false);
    }
  }

  private tryFire(): void {
    if (
      this.paused ||
      this.locked ||
      this.ending ||
      this.time.now < this.cooldownUntil ||
      this.time.now < this.uiInputBlockedUntil ||
      this.timer.expired
    ) {
      return;
    }

    this.shotCount += 1;
    const start = { x: PLAYER_X + 40, y: LASER_Y };
    const end = { x: TARGET_X, y: LASER_Y };
    const clear = evaluateLaserShot(start, end, this.obstacles);
    const shotResult = this.stageSystem.recordShot(clear);

    Laser.fire(this, clear, clear ? TARGET_X : this.getBlockedStopX());
    AudioSystem.shared.play(clear ? 'laser' : 'blocked');

    if (!clear) {
      this.effects.spark(this.getBlockedStopX(), LASER_Y);
      this.cameras.main.shake(90, 0.006);
      this.cooldownUntil = this.time.now + REFIRE_COOLDOWN_MS;
      this.player.setCooldown(this.time.now, REFIRE_COOLDOWN_MS);
      this.statusText.setText('ブロックされた');
      this.statusText.setColor('#ff5b5b');
      return;
    }

    this.locked = true;
    this.clearedStages += 1;
    AudioSystem.shared.play('targetHit');
    this.target.hitFlash();
    this.effects.targetParticles(TARGET_X, LASER_Y);
    this.player.runForward();
    this.cameras.main.shake(120, 0.004);
    this.obstacles.forEach((obstacle) => obstacle.destroyAnimation());

    if (shotResult.firstShot) {
      this.oneShotCount += 1;
      this.timer.add(this.stageSystem.getOneShotBonus(true));
      AudioSystem.shared.play('oneShot');
      this.showFloatingText('1 SHOT  +1.0 SEC', '#42f8ff');
    } else {
      this.showFloatingText('BREAKTHROUGH', '#f7fbff');
    }

    this.time.delayedCall(this.stageSystem.currentStage.transitionDuration, () => {
      if (this.ending) {
        return;
      }
      const completed = this.stageSystem.advance();
      if (completed) {
        this.endGame(true);
        return;
      }
      AudioSystem.shared.play('stageTransition');
      this.locked = false;
      this.loadStage(this.stageSystem.currentStage);
    });
  }

  private loadStage(stage: StageDefinition): void {
    this.obstacles.forEach((obstacle) => obstacle.destroy());
    this.obstacles = stage.obstacles.map((definition) => createObstacle(this, definition));
    this.elapsedSeconds = 0;
    this.statusText.setText('スキマを狙ってタップ');
    this.statusText.setColor('#f7fbff');
    this.drawBackground(this.timer.remaining <= WARNING_TIME_SECONDS);
    this.updateHud();
  }

  private updateHud(time = this.time.now): void {
    const warning = this.timer.remaining <= WARNING_TIME_SECONDS;
    this.timerText.setText(`TIME ${this.timer.remaining.toFixed(1)}`);
    this.timerText.setColor(warning ? '#ff5b5b' : '#f7fbff');
    this.stageText.setText(`STAGE ${Math.min(this.stageSystem.currentStageNumber, this.stageSystem.totalStages)}`);
    this.progress.render(Math.min(this.clearedStages, this.stageSystem.totalStages - 1));

    if (warning) {
      const pulse = 0.14 + Math.sin(time * 0.012) * 0.08;
      this.alarmOverlay.setAlpha(pulse);
      if (!this.warningActive) {
        this.drawBackground(true);
      }
      if (!this.warningActive || time >= this.nextWarningBeepAt) {
        AudioSystem.shared.play('warningAlarm');
        this.nextWarningBeepAt = time + 1100;
      }
    } else {
      this.alarmOverlay.setAlpha(0);
      if (this.warningActive) {
        this.drawBackground(false);
      }
    }

    this.warningActive = warning;
  }

  private togglePause(): void {
    if (this.ending) {
      return;
    }

    AudioSystem.shared.play('button');
    this.uiInputBlockedUntil = this.time.now + 160;
    this.paused = !this.paused;
    this.time.timeScale = this.paused ? 0 : 1;
    if (this.paused) {
      this.tweens.pauseAll();
      this.pauseOverlay = new PauseOverlay(
        this,
        () => this.togglePause(),
        () => {
          this.time.timeScale = 1;
          this.scene.start('TitleScene');
        },
      );
      return;
    }

    this.tweens.resumeAll();
    this.pauseOverlay?.destroy();
    this.pauseOverlay = null;
  }

  private drawBackground(warning: boolean): void {
    this.background.clear();
    this.background.fillStyle(warning ? 0x16070b : 0x050712, 1);
    this.background.fillRect(0, 0, 960, 540);
    this.background.lineStyle(1, warning ? 0x743046 : 0x172642, 0.5);
    for (let x = -50; x < 1040; x += 52) {
      for (let y = -30; y < 600; y += 45) {
        this.background.strokeCircle(x + ((y / 45) % 2) * 26, y, 18);
      }
    }
    this.background.lineStyle(2, 0x42f8ff, 0.28);
    this.background.lineBetween(PLAYER_X, LASER_Y, TARGET_X, LASER_Y);
    this.background.fillStyle(0x0b1228, 0.86);
    this.background.fillRect(0, 82, 208, 96);
    this.background.fillRect(752, 82, 208, 96);
    this.background.fillRect(0, 362, 208, 96);
    this.background.fillRect(752, 362, 208, 96);
    this.background.lineStyle(2, UI_COLORS.cyan, 0.36);
    this.background.strokeRect(10, 94, 186, 72);
    this.background.strokeRect(764, 94, 186, 72);
    this.background.strokeRect(10, 374, 186, 72);
    this.background.strokeRect(764, 374, 186, 72);
    if (warning) {
      this.background.lineStyle(6, 0xff253f, 0.82);
      this.background.strokeRect(6, 6, 948, 528);
    }
  }

  private drawHudFrame(): void {
    const hud = this.add.graphics();
    hud.setDepth(-1);
    hud.fillStyle(0x02040b, 0.76);
    hud.fillRoundedRect(34, 12, 892, 56, 8);
    hud.lineStyle(2, UI_COLORS.cyan, 0.62);
    hud.strokeRoundedRect(34, 12, 892, 56, 8);
    hud.lineStyle(1, UI_COLORS.magenta, 0.42);
    hud.lineBetween(64, 66, 896, 66);
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

  private getBlockedStopX(): number {
    const shapes = this.obstacles.flatMap((obstacle) => obstacle.getCollisionShapes());
    const collisionXs = shapes.map((shape) => getShapeLeftX(shape)).filter((x) => x > PLAYER_X + 40 && x < TARGET_X);
    return Math.max(PLAYER_X + 56, Math.min(...collisionXs, TARGET_X));
  }

  private endGame(cleared: boolean): void {
    if (this.ending) {
      return;
    }

    this.ending = true;
    this.locked = true;
    this.time.timeScale = 1;
    this.tweens.resumeAll();
    this.pauseOverlay?.destroy();
    this.pauseOverlay = null;

    const payload: ResultPayload = {
      cleared,
      reachedStage: cleared ? this.stageSystem.totalStages : Math.min(this.clearedStages + 1, this.stageSystem.totalStages),
      remainingTime: this.timer.remaining,
      oneShotCount: this.oneShotCount,
      shotCount: this.shotCount,
    };

    if (cleared) {
      this.scene.start('ResultScene', payload);
      return;
    }

    AudioSystem.shared.play('explosion');
    this.cameras.main.shake(900, 0.015);
    this.effects.explosionSequence(() => this.scene.start('ResultScene', payload));
  }
}

function getShapeLeftX(shape: CollisionShape): number {
  if (shape.type === 'aabb') {
    return shape.box.x;
  }
  if (shape.type === 'obb') {
    return shape.box.center.x - shape.box.width / 2;
  }
  return Math.min(...shape.polygon.points.map((point) => point.x));
}
