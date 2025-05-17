class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize scene variables
        this.score = 0;
        this.gameSpeed = 1;
        this.isGameOver = false;
        
        // Create background with parallax effect
        this.createBackground();
        
        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.createInitialPlatforms();
        
        // Create player
        this.createPlayer();
        
        // Create collectibles
        this.coins = this.physics.add.group();
        
        // Create obstacles
        this.obstacles = this.physics.add.group();
        
        // Set up collisions
        this.setupCollisions();
        
        // Create UI elements
        this.createUI();
        
        // Set up camera to follow player
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
        this.cameras.main.setDeadzone(200, 0);
        
        // Set up level generation
        this.nextPlatformPosition = 800;
        this.lastPlatformY = 500;
        
        // Set up score manager
        this.scoreManager = new ScoreManager(this);
        
        // Set up controls
        this.setupControls();
    }

    update() {
        if (this.isGameOver) return;
        
        // Move player forward automatically
        this.player.x += 5 * this.gameSpeed;
        
        // Generate new platforms as player moves forward
        if (this.player.x > this.nextPlatformPosition - 800) {
            this.generateNextPlatformSection();
        }
        
        // Check if player has fallen off the screen
        if (this.player.y > this.cameras.main.height + 100) {
            this.gameOver();
        }
        
        // Update score based on distance
        this.scoreManager.updateScore(Math.floor(this.player.x / 10));
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Increase game speed gradually
        this.gameSpeed += 0.0001;
    }
    
    createBackground() {
        // Create multiple background layers for parallax effect
        this.bg1 = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0, 0);
    }
    
    createInitialPlatforms() {
        // Create starting platform
        for (let i = 0; i < 10; i++) {
            const platform = this.platforms.create(i * 100, 500, 'platform');
            platform.setScale(2);
            platform.refreshBody();
        }
    }
    
    createPlayer() {
        // Create player sprite
        this.player = this.physics.add.sprite(100, 400, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(false);
        
        // Player states
        this.player.isJumping = false;
        this.player.hasDoubleJumped = false;
        
        // Create player animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: 0
        });
        
        // Start with running animation
        this.player.anims.play('run', true);
    }
    
    setupCollisions() {
        // Player collides with platforms
        this.physics.add.collider(this.player, this.platforms, this.handlePlatformCollision, null, this);
        
        // Player collects coins
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        
        // Player hits obstacles
        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
    }
    
    createUI() {
        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setScrollFactor(0);
    }
    
    setupControls() {
        // Jump on tap/click
        this.input.on('pointerdown', this.jump, this);
        
        // Jump on spacebar
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.jumpKey.on('down', this.jump, this);
    }
    
    jump() {
        if (this.isGameOver) return;
        
        if (!this.player.isJumping) {
            // First jump
            this.player.setVelocityY(-600);
            this.player.isJumping = true;
            this.player.anims.play('jump');
            this.sound.play('jump');
        } else if (!this.player.hasDoubleJumped) {
            // Double jump
            this.player.setVelocityY(-450);
            this.player.hasDoubleJumped = true;
            this.player.anims.play('jump');
            this.sound.play('jump');
        }
    }
    
    handlePlatformCollision() {
        // Reset jump state when landing on platform
        if (this.player.body.touching.down) {
            this.player.isJumping = false;
            this.player.hasDoubleJumped = false;
            this.player.anims.play('run', true);
        }
    }
    
    generateNextPlatformSection() {
        // Generate a new section of platforms with varying heights and gaps
        const sectionWidth = 800;
        const platformCount = Phaser.Math.Between(3, 6);
        
        for (let i = 0; i < platformCount; i++) {
            // Calculate platform position
            const platformWidth = Phaser.Math.Between(2, 5) * 100;
            const platformX = this.nextPlatformPosition + (i * sectionWidth / platformCount);
            
            // Vary platform height within reasonable bounds
            this.lastPlatformY += Phaser.Math.Between(-100, 100);
            this.lastPlatformY = Phaser.Math.Clamp(this.lastPlatformY, 300, 550);
            
            // Create platform
            const platform = this.platforms.create(platformX, this.lastPlatformY, 'platform');
            platform.setScale(platformWidth / 100, 2);
            platform.refreshBody();
            
            // Add coins with 50% probability
            if (Phaser.Math.Between(0, 1) === 1) {
                this.createCoins(platformX, this.lastPlatformY - 50);
            }
            
            // Add obstacles with 30% probability
            if (Phaser.Math.Between(0, 9) < 3) {
                this.createObstacle(platformX, this.lastPlatformY - 40);
            }
        }
        
        // Update next platform position
        this.nextPlatformPosition += sectionWidth;
    }
    
    createCoins(x, y) {
        // Create a group of coins above a platform
        const coinCount = Phaser.Math.Between(3, 6);
        
        for (let i = 0; i < coinCount; i++) {
            const coin = this.coins.create(x + (i * 30), y, 'coin');
            coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
            coin.setCircle(12);
        }
    }
    
    createObstacle(x, y) {
        // Create an obstacle on a platform
        const obstacle = this.obstacles.create(x, y, 'spike');
        obstacle.setImmovable(true);
    }
    
    collectCoin(player, coin) {
        // Remove coin and update score
        coin.disableBody(true, true);
        this.score += 10;
        this.sound.play('coin-pickup');
        
        // Visual feedback
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 100,
            yoyo: true
        });
    }
    
    hitObstacle(player, obstacle) {
        // Game over when hitting an obstacle
        this.gameOver();
    }
    
    gameOver() {
        if (this.isGameOver) return;
        
        this.isGameOver = true;
        this.player.setTint(0xff0000);
        this.player.anims.stop();
        
        // Play game over sound
        this.sound.play('game-over');
        
        // Update high score if needed
        if (this.score > this.game.globals.highScore) {
            this.game.globals.highScore = this.score;
        }
        
        // Show game over screen after a short delay
        this.time.delayedCall(1000, () => {
            // Show interstitial ad before game over screen (if available)
            if (this.game.adManager && typeof this.game.adManager.showInterstitial === 'function') {
                this.game.adManager.showInterstitial(() => {
                    this.scene.start('GameOverScene', { score: this.score });
                });
            } else {
                // If ad manager is not available, show game over screen directly
                this.scene.start('GameOverScene', { score: this.score });
            }
        });
    }
}
