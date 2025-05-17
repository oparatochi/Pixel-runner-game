class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        // Add background
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
            .setScale(2)
            .setScrollFactor(0);

        // Add game over text
        const gameOverText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 3,
            'GAME OVER',
            {
                font: 'bold 48px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Add score text
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            `SCORE: ${this.score}`,
            {
                font: '32px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        // Add high score text
        if (this.score >= this.game.globals.highScore) {
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 50,
                'NEW HIGH SCORE!',
                {
                    font: '24px Arial',
                    fill: '#ffff00',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            ).setOrigin(0.5);
        } else {
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 50,
                `HIGH SCORE: ${this.game.globals.highScore}`,
                {
                    font: '24px Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            ).setOrigin(0.5);
        }

        // Create retry button
        const retryButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            'button'
        ).setScale(2).setInteractive();

        // Add text to retry button
        const retryText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            'RETRY',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Button hover effect
        retryButton.on('pointerover', () => {
            retryButton.setTint(0xcccccc);
        });

        retryButton.on('pointerout', () => {
            retryButton.clearTint();
        });

        // Button click event
        retryButton.on('pointerdown', () => {
            // Show interstitial ad before restarting game (if available)
            if (this.game.adManager && typeof this.game.adManager.showInterstitial === 'function') {
                this.game.adManager.showInterstitial(() => {
                    this.scene.start('GameScene');
                });
            } else {
                // If ad manager is not available, restart game directly
                this.scene.start('GameScene');
            }
        });

        // Create main menu button
        const menuButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 200,
            'button'
        ).setScale(2).setInteractive();

        // Add text to main menu button
        const menuText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 200,
            'MAIN MENU',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Button hover effect
        menuButton.on('pointerover', () => {
            menuButton.setTint(0xcccccc);
        });

        menuButton.on('pointerout', () => {
            menuButton.clearTint();
        });

        // Button click event
        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
