import Phaser from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH } from './constants';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { HowToScene } from './scenes/HowToScene';
import { RecordsScene } from './scenes/RecordsScene';
import { ResultScene } from './scenes/ResultScene';
import { TitleScene } from './scenes/TitleScene';

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#050712',
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
  },
  render: {
    antialias: true,
  },
  scene: [BootScene, TitleScene, HowToScene, GameScene, ResultScene, RecordsScene],
};
