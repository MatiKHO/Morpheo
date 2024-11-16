class Chest {
  constructor({ x, y, size, imageSrc, sprites, key }) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };

    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.loaded = true;
    };
    this.image.src = imageSrc;

    this.currentFrame = 0;
    this.elapsedTime = 0;
    this.sprites = sprites;

    this.currentSprite = this.sprites.closed;
    this.isOpening = false;
    this.isOpened = false;
    this.key = key;
  }

  draw(c) {
    if (!this.loaded) return;
    c.save();
    c.drawImage(
      this.image,
      this.currentSprite.x,
      this.currentSprite.y,
      this.currentSprite.width,
      this.currentSprite.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    c.restore();
  }

  open() {
    if (!this.isOpened) {
      this.currentSprite = this.sprites.open;
      this.isOpening = false;
      this.isOpened = true;
      if (this.key && keysObtained.length < 3) {
        keysObtained.push(this.key);
      }
      obtainKeySound.play();
    }
  }

  update(deltaTime) {
    if (!deltaTime) return;

    if (this.isOpening) {
      this.currentSprite = this.sprites.open;
      this.isOpening = false;
    }
  }

  isPlayerNear(player) {
    const distance = Math.hypot(player.x - this.x, player.y - this.y);
    return distance < 20;
  }

  checkForCollisions(player) {
    if (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    ) {
      this.handleCollision(player);
    }
  }

  handleCollision(player) {
    if (player.x < this.x) {
      player.x = this.x - player.width;
    } else if (player.x + player.width > this.x + this.width) {
      player.x = this.x + this.width;
    }

    if (player.y < this.y) {
      player.y = this.y - player.height;
    } else if (player.y + player.height > this.y + this.height) {
      player.y = this.y + this.height;
    }
  }
}
