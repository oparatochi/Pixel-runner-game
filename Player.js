class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        // Add player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set up physics properties
        this.setBounce(0.1);
        this.setCollideWorldBounds(false);
        
        // Player state variables
        this.isJumping = false;
        this.hasDoubleJumped = false;
        this.isSliding = false;
        
        // Set up animations
        this.setupAnimations();
        
        // Start with running animation
        this.play('run');
    }
    
    setupAnimations() {
        // Only create animations if they don't already exist
        if (!this.scene.anims.exists('run')) {
            this.scene.anims.create({
                key: 'run',
                frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('jump')) {
            this.scene.anims.create({
                key: 'jump',
                frames: this.scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
                frameRate: 10,
                repeat: 0
            });
        }
        
        if (!this.scene.anims.exists('slide')) {
            this.scene.anims.create({
                key: 'slide',
                frames: this.scene.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }
    
    update() {
        // Handle automatic movement
        this.x += 5 * this.scene.gameSpeed;
        
        // Handle animations based on state
        if (this.body.touching.down && !this.isSliding) {
            this.isJumping = false;
            this.hasDoubleJumped = false;
            
            if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'run') {
                this.play('run');
            }
        }
        
        // Handle slide completion
        if (this.isSliding && this.anims.currentAnim.key === 'slide' && !this.anims.isPlaying) {
            this.isSliding = false;
            this.body.setSize(this.width, this.height);
            this.play('run');
        }
    }
    
    jump() {
        if (this.isSliding) return;
        
        if (!this.isJumping) {
            // First jump
            this.setVelocityY(-600);
            this.isJumping = true;
            this.play('jump');
            this.scene.sound.play('jump');
        } else if (!this.hasDoubleJumped) {
            // Double jump
            this.setVelocityY(-450);
            this.hasDoubleJumped = true;
            this.play('jump');
            this.scene.sound.play('jump');
        }
    }
    
    slide() {
        if (this.isJumping || this.isSliding) return;
        
        this.isSliding = true;
        this.play('slide');
        
        // Reduce hitbox height during slide
        this.body.setSize(this.width, this.height / 2);
        this.body.offset.y = this.height / 2;
        
        // End slide after a fixed duration
        this.scene.time.delayedCall(1000, () => {
            if (this.isSliding) {
                this.isSliding = false;
                this.body.setSize(this.width, this.height);
                this.body.offset.y = 0;
                this.play('run');
            }
        });
    }
    
    die() {
        this.setTint(0xff0000);
        this.anims.stop();
    }
}
