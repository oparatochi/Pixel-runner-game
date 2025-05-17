class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Add background
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
            .setScale(2)
            .setScrollFactor(0);

        // Add game title
        const title = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 3,
            'PIXEL RUNNER',
            {
                font: 'bold 48px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Create play button
        const playButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            'button'
        ).setScale(2).setInteractive();

        // Add text to play button
        const playText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            'PLAY',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Button hover effect
        playButton.on('pointerover', () => {
            playButton.setTint(0xcccccc);
        });

        playButton.on('pointerout', () => {
            playButton.clearTint();
        });

        // Button click event
        playButton.on('pointerdown', () => {
            // Show interstitial ad before starting game (if available)
            if (this.game.adManager && typeof this.game.adManager.showInterstitial === 'function') {
                this.game.adManager.showInterstitial(() => {
                    this.scene.start('GameScene');
                });
            } else {
                // If ad manager is not available, start game directly
                this.scene.start('GameScene');
            }
        });

        // Add high score text if available
        if (this.game.globals.highScore > 0) {
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 150,
                `HIGH SCORE: ${this.game.globals.highScore}`,
                {
                    font: '24px Arial',
                    fill: '#ffffff'
                }
            ).setOrigin(0.5);
        }

        // Add background music if not already playing
        if (!this.sound.get('background-music')) {
            const music = this.sound.add('background-music', {
                volume: 0.5,
                loop: true
            });
            music.play();
        }
    }
}
