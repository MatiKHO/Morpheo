class Chest{
    constructor({ x, y, size, imageSrc, sprites}) {
      this.x = x;
      this.y = y;
      this.width = size;
      this.height = size;
    
      this.center = {
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
      }
      this.loaded = false;
      this.image = new Image();
      this.image.onload = () => {
        this.loaded = true;
      };
  
      this.image.src = imageSrc;
  
      this.currentFrame = 0;
      this.elapsedTime = 0;
      this.sprites = sprites
  
      this.currentSprite = 0;
    
    }
     
  
    draw(c) {
      if (!this.loaded) return;
      c.save();
      c.drawImage(
        this.image,
        this.currentSprite,
        this.currentSprite,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      c.restore();
  
    }
  
    // Update chest position and check for collisions
    update(deltaTime) {
      if (!deltaTime) return;
  
      // Update elapsed time
      this.elapsedTime += deltaTime;
  
      // // Update current frame for player animation
      const intervalToGoNextFrame = 0.15;
      if (this.elapsedTime > intervalToGoNextFrame) {
        this.currentFrame =
          (this.currentFrame + 1) % this.currentSprite.frameCount;
        this.elapsedTime -= intervalToGoNextFrame;
      }
  
  
      this.center = {
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
        };
  
    }
  }
  
  
  