class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, width) {
        super(scene, x, y, 'platform');
        
        // Add platform to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = static body
        
        // Set platform width
        this.setScale(width / 100, 2);
        this.refreshBody();
        
        // Platform properties
        this.type = 'normal'; // normal, moving, disappearing, bouncy, slippery
        this.direction = null; // for moving platforms
        this.speed = 0; // for moving platforms
        this.range = 0; // for moving platforms
        this.startPosition = { x: x, y: y }; // for moving platforms
        this.disappearTimer = null; // for disappearing platforms
    }
    
    makeMoving(direction, speed, range) {
        this.type = 'moving';
        this.direction = direction;
        this.speed = speed;
        this.range = range;
        
        // Convert to dynamic body
        this.scene.physics.world.remove(this.body);
        this.body.destroy();
        this.scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.allowGravity = false;
    }
    
    makeDisappearing(delay) {
        this.type = 'disappearing';
        this.disappearDelay = delay || 1000;
    }
    
    makeBouncy() {
        this.type = 'bouncy';
        this.setTint(0x00ff00);
    }
    
    makeSlippery() {
        this.type = 'slippery';
        this.setTint(0x00ffff);
    }
    
    update() {
        if (this.type === 'moving') {
            this.updateMovingPlatform();
        }
    }
    
    updateMovingPlatform() {
        if (this.direction === 'horizontal') {
            // Move horizontally within range
            if (this.x > this.startPosition.x + this.range) {
                this.speed = -Math.abs(this.speed);
            } else if (this.x < this.startPosition.x - this.range) {
                this.speed = Math.abs(this.speed);
            }
            this.x += this.speed;
        } else if (this.direction === 'vertical') {
            // Move vertically within range
            if (this.y > this.startPosition.y + this.range) {
                this.speed = -Math.abs(this.speed);
            } else if (this.y < this.startPosition.y - this.range) {
                this.speed = Math.abs(this.speed);
            }
            this.y += this.speed;
        } else if (this.direction === 'circular') {
            // Move in a circular pattern
            const angle = this.scene.time.now / 1000 * this.speed;
            this.x = this.startPosition.x + Math.cos(angle) * this.range;
            this.y = this.startPosition.y + Math.sin(angle) * this.range;
        }
        
        // Update physics body position
        this.body.updateFromGameObject();
    }
    
    startDisappearing() {
        if (this.type === 'disappearing' && !this.disappearTimer) {
            // Visual feedback - platform starts blinking
            this.scene.tweens.add({
                targets: this,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                repeat: 5
            });
            
            // Set timer to make platform disappear
            this.disappearTimer = this.scene.time.delayedCall(this.disappearDelay, () => {
                this.disableBody(true, true);
            });
        }
    }
    
    handlePlayerCollision(player) {
        switch (this.type) {
            case 'disappearing':
                this.startDisappearing();
                break;
                
            case 'bouncy':
                player.setVelocityY(-800); // Higher bounce
                break;
                
            case 'slippery':
                // Slippery effect handled in the game scene
                break;
        }
    }
}
