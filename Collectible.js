class Collectible extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type || 'coin');
        
        // Add collectible to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Collectible properties
        this.collectibleType = type || 'coin';
        this.value = 10; // Default value
        this.powerupDuration = 0; // For powerups
        
        // Set up based on type
        this.setupCollectibleType();
        
        // Add bounce effect
        this.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
        
        // Add animation
        this.setupAnimation();
    }
    
    setupCollectibleType() {
        switch (this.collectibleType) {
            case 'coin':
                this.value = 10;
                break;
                
            case 'silver_coin':
                this.value = 50;
                this.setTint(0xcccccc);
                break;
                
            case 'gold_coin':
                this.value = 100;
                this.setTint(0xffff00);
                break;
                
            case 'shield_powerup':
                this.value = 0;
                this.powerupDuration = 10000; // 10 seconds
                this.setTint(0x0000ff);
                break;
                
            case 'magnet_powerup':
                this.value = 0;
                this.powerupDuration = 8000; // 8 seconds
                this.setTint(0xff00ff);
                break;
                
            case 'speed_powerup':
                this.value = 0;
                this.powerupDuration = 5000; // 5 seconds
                this.setTint(0xff0000);
                break;
                
            case 'jump_powerup':
                this.value = 0;
                this.powerupDuration = 7000; // 7 seconds
                this.setTint(0x00ff00);
                break;
        }
    }
    
    setupAnimation() {
        // Only create animation if it doesn't already exist
        if (!this.scene.anims.exists('coin_spin')) {
            this.scene.anims.create({
                key: 'coin_spin',
                frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        // Play animation
        if (this.collectibleType.includes('coin')) {
            this.play('coin_spin');
        }
    }
    
    collect() {
        // Visual effect on collection
        this.scene.tweens.add({
            targets: this,
            y: this.y - 50,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.destroy();
            }
        });
        
        // Return value for score calculation
        return this.value;
    }
    
    applyPowerup(player) {
        switch (this.collectibleType) {
            case 'shield_powerup':
                // Apply shield effect
                player.setTint(0x0000ff);
                player.isShielded = true;
                
                // Remove effect after duration
                this.scene.time.delayedCall(this.powerupDuration, () => {
                    player.clearTint();
                    player.isShielded = false;
                });
                break;
                
            case 'magnet_powerup':
                // Apply magnet effect (handled in game scene)
                this.scene.magnetActive = true;
                
                // Remove effect after duration
                this.scene.time.delayedCall(this.powerupDuration, () => {
                    this.scene.magnetActive = false;
                });
                break;
                
            case 'speed_powerup':
                // Apply speed boost
                this.scene.gameSpeed *= 1.3;
                
                // Remove effect after duration
                this.scene.time.delayedCall(this.powerupDuration, () => {
                    this.scene.gameSpeed /= 1.3;
                });
                break;
                
            case 'jump_powerup':
                // Apply jump boost
                const originalJumpForce = this.scene.game.globals.jumpForce;
                const originalDoubleJumpForce = this.scene.game.globals.doubleJumpForce;
                
                this.scene.game.globals.jumpForce *= 1.4;
                this.scene.game.globals.doubleJumpForce *= 1.4;
                
                // Remove effect after duration
                this.scene.time.delayedCall(this.powerupDuration, () => {
                    this.scene.game.globals.jumpForce = originalJumpForce;
                    this.scene.game.globals.doubleJumpForce = originalDoubleJumpForce;
                });
                break;
        }
    }
}
