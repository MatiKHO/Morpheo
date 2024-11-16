const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;

canvas.width = 1024 * dpr;
canvas.height = 576 * dpr;

const MAP_COLS = 40;
const MAP_ROWS = 30;

const TILE_SIZE = 16;

const MAP_WIDTH = TILE_SIZE * MAP_COLS;
const MAP_HEIGTH = TILE_SIZE * MAP_ROWS;

const MAP_SCALE = dpr + 1;

const VIEWPORT_WIDTH = canvas.width / MAP_SCALE;
const VIEWPORT_HEIGHT = canvas.height / MAP_SCALE;

const VIEWPORT_CENTER_X = VIEWPORT_WIDTH / 2;
const VIEWPORT_CENTER_Y = VIEWPORT_HEIGHT / 2;

const MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH;
const MAX_SCROLL_Y = MAP_HEIGTH - VIEWPORT_HEIGHT;

// Music
const soundEffectsVolume = 0.5;

const backgroundMusic = new Audio("./music/game/main-theme.ogg");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

// Sound effects
const attackSound = new Audio("./music/game/attack.wav");
attackSound.volume = soundEffectsVolume;
const killSound = new Audio("./music/game/kill.wav");
killSound.volume = soundEffectsVolume;
const enemyHitSound = new Audio("./music/game/enemyHit.wav");
enemyHitSound.volume = soundEffectsVolume;
const obtainKeySound = new Audio("./music/game/obtainKey.wav");
obtainKeySound.volume = soundEffectsVolume;
const restartSound = new Audio("./music/menu/accept.wav");
restartSound.volume = soundEffectsVolume;

document.getElementById("play-button").addEventListener("click", function () {
  this.style.display = "none";
  backgroundMusic.play();
});

const layersData = {
  l_Base: l_Base,
  l_Terrain: l_Terrain,
  l_Trees_3: l_Trees_3,
  l_Trees: l_Trees,
  l_Trees_2: l_Trees_2,
  l_Frogs: l_Frogs,
  l_House: l_House,
  l_Boxes: l_Boxes,
  l_Enemies: l_Enemies,
  l_Collisions: l_Collisions,
};

const frontRendersLayersData = {
  l_Front_Renders: l_Front_Renders,
};

const tilesets = {
  l_Base: { imageUrl: "./images/terrain.png", tileSize: 16 },
  l_Terrain: { imageUrl: "./images/terrain.png", tileSize: 16 },
  l_Trees_3: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Trees: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Trees_2: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Frogs: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Front_Renders: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_House: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Boxes: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Player: { imageUrl: "./images/characters.png", tileSize: 16 },
  l_Enemies: { imageUrl: "./images/characters.png", tileSize: 16 },
  l_Collisions: { imageUrl: "./images/characters.png", tileSize: 16 },
};

// Tile setup
const collisionBlocks = [];
const blockSize = 16; // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        })
      );
    }
  });
});

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX =
          ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize;
        const srcY =
          Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize;

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16 // destination width, height
        );
      }
    });
  });
};

const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenContext = offscreenCanvas.getContext("2d");

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName];
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl);
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext
        );
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error);
      }
    }
  }

  return offscreenCanvas;
};

// Change xy coordinates to move player's default position
const player = new Player({
  x: 288,
  y: 224,
  size: 15,
});

const monsterSprites = {
  walkDown: {
    x: 0,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkUp: {
    x: 16,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkLeft: {
    x: 32,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkRight: {
    x: 48,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
};

const monsters = [
  new Monster({
    x: 304,
    y: 32,
    size: 15,
    imageSrc: "./images/dragon.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 304,
    y: 48,
    size: 15,
    imageSrc: "./images/dragon.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 448,
    y: 32,
    size: 15,
    imageSrc: "./images/eskeleton.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 448,
    y: 48,
    size: 15,
    imageSrc: "./images/eskeleton.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 576,
    y: 272,
    size: 15,
    imageSrc: "./images/eskeleton.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 80,
    y: 256,
    size: 15,
    imageSrc: "./images/knight.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 384,
    y: 320,
    size: 15,
    imageSrc: "./images/mage.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 400,
    y: 336,
    size: 15,
    imageSrc: "./images/mage.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 480,
    y: 144,
    size: 15,
    imageSrc: "./images/robot.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 480,
    y: 160,
    size: 15,
    imageSrc: "./images/robot.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 48,
    y: 48,
    size: 15,
    imageSrc: "./images/master.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 240,
    y: 432,
    size: 15,
    imageSrc: "./images/boss.png",
    sprites: monsterSprites,
  }),
];

const chestSprites = {
  closed: {
    x: 0,
    y: 0,
    width: 16,
    height: 16,
  },
  open: {
    x: 16,
    y: 0,
    width: 16,
    height: 16,
  },
};

const keysObtained = [];

const chests = [
  new Chest({
    x: 304,
    y: 288,
    size: 15,
    imageSrc: "./images/chest.png",
    sprites: chestSprites,
    key: new Key({
      x: 98,
      y: 10,
      imageSrc: "./images/key.png",
    }),
  }),
  new Chest({
    x: 528,
    y: 144,
    size: 15,
    imageSrc: "./images/chest.png",
    sprites: chestSprites,
    key: new Key({
      x: 120,
      y: 10,
      imageSrc: "./images/key.png",
    }),
  }),
  new Chest({
    x: 224,
    y: 416,
    size: 15,
    imageSrc: "./images/chest.png",
    sprites: chestSprites,
    key: new Key({
      x: 142,
      y: 10,
      imageSrc: "./images/key.png",
    }),
  }),
];

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  enter: {
    pressed: false,
  },
};

let lastTime = performance.now();
let frontRendersCanvas;
const hearts = [
  new Heart({
    x: 10,
    y: 10,
  }),
  new Heart({
    x: 32,
    y: 10,
  }),
  new Heart({
    x: 54,
    y: 10,
  }),
];

const leafs = [
  new Particle({
    x: 20,
    y: 20,
    velocity: {
      x: 0.08,
      y: 0.08,
    },
  }),
];

let elapsedTime = 0;

function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  elapsedTime += deltaTime;

  if (elapsedTime > 1.5) {
    leafs.push(
      new Particle({
        x: Math.random() * 500,
        y: Math.random() * 50,
        velocity: {
          x: 0.08,
          y: 0.08,
        },
      })
    );
    elapsedTime = 0;
  }

  // Update player position
  player.handleInput(keys);
  player.update(deltaTime, collisionBlocks);

  const horizontalScrollDistance = Math.min(
    Math.max(0, player.center.x - VIEWPORT_CENTER_X),
    MAX_SCROLL_X
  );
  const verticalScrollDistance = Math.min(
    Math.max(0, player.center.y - VIEWPORT_CENTER_Y),
    MAX_SCROLL_Y
  );

  // Render scene
  c.save();
  c.scale(MAP_SCALE, MAP_SCALE);
  c.translate(-horizontalScrollDistance, -verticalScrollDistance);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(backgroundCanvas, 0, 0);
  player.draw(c);

  // Render chests
  for (let i = chests.length - 1; i >= 0; i--) {
    const chest = chests[i];
    chest.update(deltaTime);
    chest.checkForCollisions(player);
    chest.draw(c);

    if (chest.isPlayerNear(player) && keys.enter.pressed) {
      chest.open();
    }
  }

  // Render out monsters
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    monster.update(deltaTime, collisionBlocks);
    monster.draw(c);

    // Detect for collision
    if (
      player.attackBox.x + player.attackBox.width >= monster.x && //  Attack from the right
      player.attackBox.x <= monster.x + monster.width && // Attack from the left
      player.attackBox.y + player.attackBox.height >= monster.y && // Attack from the bottom
      player.attackBox.y <= monster.y + monster.height &&
      player.isAttacking &&
      !player.hasHitEnemy // Attack from the top
    ) {
      monster.receiveHit();
      player.hasHitEnemy = true;
      attackSound.play();

      if (monster.health <= 0) {
        monsters.splice(i, 1);
        killSound.play();
      }
    }

    // Detect for player attack
    if (
      player.x + player.width >= monster.x && //  Attack from the right
      player.x <= monster.x + monster.width && // Attack from the left
      player.y + player.height >= monster.y && // Attack from the bottom
      player.y <= monster.y + monster.height &&
      !player.isInvincible
    ) {
      player.receiveHit();
      enemyHitSound.play();

      const filledHearts = hearts.filter((heart) => heart.currentFrame === 4);

      if (filledHearts.length > 0) {
        filledHearts[filledHearts.length - 1].currentFrame = 0;
      }

      if (filledHearts.length === 0) {
        const gameOverElement = document.getElementById("game-over");
        gameOverElement.classList.add("visible");

        const restartButton = document.getElementById("restart-button");
        restartButton.classList.add("button-visible");

        restartSound.play();

        restartButton.addEventListener("click", () => {
          location.reload();
        });
        return;
      }
    }
  }

  // Check for victory
  if (keysObtained.length === 3 && filledHearts.length !== 0) {
    const victoryElement = document.getElementById("victory");
    victoryElement.classList.add("visible");

    const restartButton = document.getElementById("restart-button");
    restartButton.classList.add("button-visible");

    restartSound.play();

    restartButton.addEventListener("click", () => {
      location.reload();
    });
    return;
  }

  c.drawImage(frontRendersCanvas, 0, 0);

  for (let i = leafs.length - 1; i >= 0; i--) {
    const leaf = leafs[i];
    leaf.update(deltaTime);
    leaf.draw(c);

    if (leaf.alpha <= 0) {
      leafs.splice(i, 1);
    }
  }

  c.restore();

  c.save();
  c.scale(MAP_SCALE, MAP_SCALE);
  hearts.forEach((heart) => {
    heart.draw(c);
  });
  keysObtained.forEach((key, index) => {
    key.x = 98 + index * 22; // Ajusta la posición de las llaves
    key.draw(c);
  });
  c.restore();

  requestAnimationFrame(() => animate(backgroundCanvas));
}

const startRendering = async () => {
  try {
    const backgroundCanvas = await renderStaticLayers(layersData);
    frontRendersCanvas = await renderStaticLayers(frontRendersLayersData);
    if (!backgroundCanvas) {
      console.error("Failed to create the background canvas");
      return;
    }
    backgroundMusic.play();

    animate(backgroundCanvas);
  } catch (error) {
    console.error("Error during rendering:", error);
  }
};

startRendering();
