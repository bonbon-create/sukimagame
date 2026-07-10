import Phaser from 'phaser';
import { LASER_Y, PLAYER_X, TARGET_X } from '../constants';

export class Laser {
  public static fire(scene: Phaser.Scene, clear: boolean, stopX = TARGET_X): void {
    const graphics = scene.add.graphics();
    graphics.lineStyle(5, clear ? 0x8effff : 0xff5b5b, 1);
    graphics.lineBetween(PLAYER_X + 40, LASER_Y, stopX, LASER_Y);
    graphics.lineStyle(13, clear ? 0x42f8ff : 0xff4f6a, 0.22);
    graphics.lineBetween(PLAYER_X + 40, LASER_Y, stopX, LASER_Y);
    scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: clear ? 250 : 170,
      onComplete: () => graphics.destroy(),
    });
  }
}
