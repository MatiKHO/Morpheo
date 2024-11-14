
 class Monster {
  constructor({ x, y, size, velocity = { x: 0, y: 0 }, imageSrc, sprites }) {
    this.x = x;
    this.y = y;
    this.originalPosition = { x: x, y: y };
    this.width = size;
    this.height = size;
    this.velocity = velocity;
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
    this.elapsedMovementTime = 0;
    this.sprites = sprites;

    this.currentSprite = Object.values(this.sprites)[0];
  }

  draw(c) {
    if (!this.loaded) return;
    // Red square debug code
    // c.fillStyle = "rgba(0, 0, 255, 0.5)";
    // c.fillRect(this.x, this.y, this.width, this.height);

    // Draw player image
    c.drawImage(
      this.image,
      this.currentSprite.x,
      this.currentSprite.height * this.currentFrame,
      this.currentSprite.width,
      this.currentSprite.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // Update player position and check for collisions
  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return;

    // Update elapsed time
    this.elapsedTime += deltaTime;

    // Update current frame for player animation
    const intervalToGoNextFrame = 0.15;
    if (this.elapsedTime > intervalToGoNextFrame) {
      this.currentFrame = (this.currentFrame + 1) % this.currentSprite.frameCount;
      this.elapsedTime -= intervalToGoNextFrame;
    }

    // Randomly choose place for enemy to move to
    this.setVelocity(deltaTime)

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime);
    this.checkForHorizontalCollisions(collisionBlocks);

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime);
    this.checkForVerticalCollisions(collisionBlocks);

    // Update center position
    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  // Set velocity for the monster to move to a random location
  setVelocity(deltaTime) {
    const changeDirectionInterval = 2;
    if (this.elapsedMovementTime > changeDirectionInterval || this.elapsedMovementTime === 0) {
        this.elapsedMovementTime -= changeDirectionInterval;

        // Get a random angle with radians
        const angle = Math.random() * Math.PI * 2;
        const CIRCLE_RADIUS = 20;

        // Calculate monster location
        const targetLocation = {
            x: this.originalPosition.x + Math.cos(angle) * CIRCLE_RADIUS,
            y: this.originalPosition.y + Math.sin(angle) * CIRCLE_RADIUS,
        }
        // 
        const deltaX = targetLocation.x - this.x; // 40
        const deltaY = targetLocation.y - this.y; // 20

        const hypotenyse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedDeltaX = deltaX / hypotenyse; // 0.6
        const normalizedDeltaY = deltaY / hypotenyse; // 0.4

        this.velocity.x = normalizedDeltaX * CIRCLE_RADIUS;
        this.velocity.y = normalizedDeltaY * CIRCLE_RADIUS;

    this.elapsedMovementTime += deltaTime;

    }
  }

  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime;
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime;
  }

  

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001;
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      // Check if a collision exists on all axes
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going left
        if (this.velocity.x < -0) {
          this.x = collisionBlock.x + collisionBlock.width + buffer;
          this.velocity.x = -this.velocity.x;
          break;
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer;
          this.velocity.x = -this.velocity.x;
          break;
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001;
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      // If a collision exists
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if (this.velocity.y < 0) {
          
          this.y = collisionBlock.y + collisionBlock.height + buffer;
          this.velocity.y = -this.velocity.y;

          break;
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          
          this.y = collisionBlock.y - this.height - buffer;
          this.velocity.y = -this.velocity.y;
          break;
        }
      }
    }
  }
}
