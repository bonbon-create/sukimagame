import Phaser from 'phaser';

export const UI_COLORS = {
  bg: 0x050712,
  panel: 0x0b1228,
  panelSoft: 0x101a32,
  cyan: 0x42f8ff,
  cyanSoft: 0x1d9db4,
  magenta: 0xff4ff6,
  red: 0xff5b5b,
  amber: 0xffd166,
  white: 0xf7fbff,
  muted: 0x26324d,
};

export function textStyle(size: number, color = '#f7fbff', bold = false): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: bold ? 'Arial Black, system-ui, sans-serif' : 'system-ui, sans-serif',
    fontSize: `${size}px`,
    color,
  };
}

export function drawNeonBackdrop(scene: Phaser.Scene, variant: 'title' | 'menu' | 'game' = 'menu'): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  graphics.fillStyle(UI_COLORS.bg, 1);
  graphics.fillRect(0, 0, 960, 540);

  graphics.lineStyle(1, 0x182945, 0.52);
  for (let x = -42; x < 1030; x += 52) {
    for (let y = -35; y < 610; y += 45) {
      graphics.strokeCircle(x + ((y / 45) % 2) * 26, y, 18);
    }
  }

  graphics.lineStyle(2, UI_COLORS.cyan, variant === 'title' ? 0.34 : 0.22);
  graphics.lineBetween(96, 270, 854, 270);

  graphics.lineStyle(1, UI_COLORS.magenta, 0.22);
  for (let y = 72; y <= 468; y += 66) {
    graphics.lineBetween(0, y, 960, y + 18);
  }

  drawSideFacility(graphics, 0);
  drawSideFacility(graphics, 760);

  if (variant === 'title') {
    graphics.lineStyle(3, UI_COLORS.cyan, 0.9);
    graphics.strokeRect(132, 82, 696, 374);
    graphics.lineStyle(1, UI_COLORS.magenta, 0.72);
    graphics.strokeRect(144, 94, 672, 350);
  }

  return graphics;
}

export function createNeonButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  onClick: () => void,
  options: { accent?: number; depth?: number; fontSize?: number } = {},
): Phaser.GameObjects.Container {
  const accent = options.accent ?? UI_COLORS.cyan;
  const container = scene.add.container(x, y);
  const hitPadding = 14;
  let pressedInside = false;
  container.setDepth(options.depth ?? 0);

  const hitZone = scene.add.zone(0, 0, width + hitPadding * 2, height + hitPadding * 2);
  const graphics = scene.add.graphics();
  drawButtonFace(graphics, width, height, accent, false);
  const text = scene.add.text(0, 0, label, textStyle(options.fontSize ?? 20, '#f7fbff', false)).setOrigin(0.5);
  text.setShadow(0, 0, Phaser.Display.Color.IntegerToColor(accent).rgba, 8, true, true);

  container.add([graphics, text, hitZone]);
  container.setSize(width, height);
  hitZone.setInteractive({ useHandCursor: true });
  hitZone.on('pointerover', () => {
    graphics.clear();
    drawButtonFace(graphics, width, height, accent, true);
    scene.tweens.add({ targets: container, scale: 1.035, duration: 90, ease: 'Sine.easeOut' });
  });
  hitZone.on('pointerout', () => {
    pressedInside = false;
    graphics.clear();
    drawButtonFace(graphics, width, height, accent, false);
    scene.tweens.add({ targets: container, scale: 1, duration: 90, ease: 'Sine.easeOut' });
  });
  hitZone.on('pointerdown', () => {
    pressedInside = true;
    scene.tweens.add({ targets: container, scale: 0.96, duration: 55, yoyo: true, ease: 'Sine.easeOut' });
  });
  hitZone.on('pointerup', () => {
    if (!pressedInside) {
      return;
    }
    pressedInside = false;
    onClick();
  });

  return container;
}

export function drawNeonPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  accent = UI_COLORS.cyan,
  depth = 0,
): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  graphics.setDepth(depth);
  graphics.fillStyle(UI_COLORS.panel, 0.88);
  graphics.fillRoundedRect(x, y, width, height, 8);
  graphics.lineStyle(2, accent, 0.8);
  graphics.strokeRoundedRect(x, y, width, height, 8);
  graphics.lineStyle(1, UI_COLORS.white, 0.22);
  graphics.lineBetween(x + 16, y + 10, x + width - 16, y + 10);
  graphics.lineStyle(3, accent, 0.95);
  graphics.lineBetween(x + 12, y + height - 8, x + 72, y + height - 8);
  return graphics;
}

export function drawStatusPill(scene: Phaser.Scene, x: number, y: number, label: string, accent = UI_COLORS.cyan): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x091226, 0.96);
  graphics.fillRoundedRect(-86, -17, 172, 34, 6);
  graphics.lineStyle(2, accent, 0.85);
  graphics.strokeRoundedRect(-86, -17, 172, 34, 6);
  graphics.fillStyle(accent, 1);
  graphics.fillCircle(-68, 0, 5);
  const text = scene.add.text(10, 0, label, textStyle(15)).setOrigin(0.5);
  container.add([graphics, text]);
  return container;
}

function drawButtonFace(graphics: Phaser.GameObjects.Graphics, width: number, height: number, accent: number, hot: boolean): void {
  graphics.fillStyle(hot ? 0x152443 : UI_COLORS.panelSoft, hot ? 1 : 0.94);
  graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 7);
  graphics.lineStyle(hot ? 3 : 2, accent, hot ? 1 : 0.82);
  graphics.strokeRoundedRect(-width / 2, -height / 2, width, height, 7);
  graphics.fillStyle(accent, hot ? 0.34 : 0.2);
  graphics.fillRect(-width / 2 + 8, -height / 2 + 7, 42, height - 14);
  graphics.lineStyle(1, 0xffffff, hot ? 0.34 : 0.18);
  graphics.lineBetween(-width / 2 + 58, -height / 2 + 8, width / 2 - 12, -height / 2 + 8);
}

function drawSideFacility(graphics: Phaser.GameObjects.Graphics, x: number): void {
  graphics.fillStyle(0x111a31, 0.88);
  graphics.fillRect(x, 134, 200, 104);
  graphics.fillRect(x, 334, 200, 104);
  graphics.lineStyle(2, 0x8aa4d6, 0.62);
  graphics.strokeRect(x + 8, 146, 184, 76);
  graphics.strokeRect(x + 8, 346, 184, 76);
  graphics.lineStyle(1, UI_COLORS.cyan, 0.38);
  graphics.lineBetween(x + 22, 170, x + 172, 170);
  graphics.lineBetween(x + 22, 370, x + 172, 370);
}
