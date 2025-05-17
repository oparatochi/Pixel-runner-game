class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type || 'spike');
        
        // Add obstacle to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = static body
        
        // Obstacle properties
        this.obstacleType = type || 'spike';
        this.isMoving = false;
        this.movePattern = null;
        this.moveSpeed = 0;
        this.moveRange = 0;
        this.startPosition = { x: x, y: y };
        
        // Set up based on type
        this.setupObstacleType();
    }
    
    setupObstacleType() {
        switch (this.obstacleType) {
            case 'spike':
                // Default spike setup
                break;
                
            case 'moving_spike':
                this.isMoving = true;
                this.movePattern = 'horizontal';
                this.moveSpeed = 2;
                this.moveRange = 100;
                
                // Convert to dynamic body for movement
                this.scene.physics.world.remove(this.body);
                this.body.destroy();
                this.scene.physics.world.enable(this);
                this.body.setImmovable(true);
                this.body.allowGravity = false;
                break;
                
            case 'falling_rock':
                this.isMoving = true;
                this.movePattern = 'falling';
                this.body.allowGravity = true;
                this.body.setGravityY(300);
                this.body.setImmovable(false);
                break;
        }
    }
    
    update() {
        if (!this.isMoving) return;
        
        switch (this.movePattern) {
            case 'horizontal':
                // Move horizontally within range
                if (this.x > this.startPosition.x + this.moveRange) {
                    this.moveSpeed = -Math.abs(this.moveSpeed);
                } else if (this.x < this.startPosition.x - this.moveRange) {
                    this.moveSpeed = Math.abs(this.moveSpeed);
                }
                this.x += this.moveSpeed;
                
                // Update physics body position
                this.body.updateFromGameObject();
                break;
                
            case 'vertical':
                // Move vertically within range
                if (this.y > this.startPosition.y + this.moveRange) {
                    this.moveSpeed = -Math.abs(this.moveSpeed);
                } else if (this.y < this.startPosition.y - this.moveRange) {
                    this.moveSpeed = Math.abs(this.moveSpeed);
                }
                this.y += this.moveSpeed;
                
                // Update physics body position
                this.body.updateFromGameObject();
                break;
                
            case 'falling':
                // Falling is handled by physics gravity
                break;
                
            case 'swinging':
                // Swinging pendulum motion
                const angle = this.scene.time.now / 1000 * this.moveSpeed;
                this.x = this.startPosition.x + Math.cos(angle) * this.moveRange;
                
                // Update physics body position
                this.body.updateFromGameObject();
                break;
        }
    }
    
    reset() {
        // Reset to starting position
        this.x = this.startPosition.x;
        this.y = this.startPosition.y;
        this.body.updateFromGameObject();
    }
}
