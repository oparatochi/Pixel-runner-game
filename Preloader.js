class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // Display loading screen
        this.createLoadingScreen();

        // Load all game assets
        this.loadGameAssets();

        // Loading progress events
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x2196F3, 1);
            this.progressBar.fillRect(this.cameras.main.width / 4, this.cameras.main.height / 2, (this.cameras.main.width / 2) * value, 30);
        });

        this.load.on('complete', () => {
            console.log('All assets loaded');
        });
    }

    create() {
        // Initialize AdManager
        if (typeof AdManager !== 'undefined') {
            this.game.adManager = new AdManager(
                this.game.globals.publisherId,
                this.game.globals.adUnitId
            );
        }

        // Short delay before starting the main menu
        this.time.delayedCall(1000, () => {
            this.scene.start('MainMenuScene');
        });
    }

    createLoadingScreen() {
        // Add loading text
        const loadingText = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2 - 50,
            'Loading...', 
            { 
                font: '24px Arial', 
                fill: '#ffffff' 
            }
        ).setOrigin(0.5);

        // Create loading bar background
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width / 2,
            30,
            0x333333
        ).setOrigin(0.5);

        // Create loading bar progress
        this.progressBar = this.add.graphics();
    }

    loadGameAssets() {
        // Player sprites
        this.load.spritesheet('player', 'assets/images/player-spritesheet.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });

        // Platform and environment assets
        this.load.image('platform', 'assets/images/platform.png');
        this.load.image('background', 'assets/images/background.png');
        
        // Collectibles and obstacles
        this.load.image('coin', 'assets/images/coin.png');
        this.load.image('spike', 'assets/images/spike.png');
        
        // UI elements
        this.load.image('button', 'assets/images/button.png');
        this.load.image('title', 'assets/images/title.png');
        
        // Audio assets
        this.load.audio('jump', 'assets/audio/jump.mp3');
        this.load.audio('coin-pickup', 'assets/audio/coin-pickup.mp3');
        this.load.audio('game-over', 'assets/audio/game-over.mp3');
        this.load.audio('background-music', 'assets/audio/background-music.mp3');
    }
}
