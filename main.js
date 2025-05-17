// Main game configuration and initialization
window.onload = function() {
    // Game configuration
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1000 },
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [
            BootScene,
            PreloaderScene,
            MainMenuScene,
            GameScene,
            GameOverScene
        ]
    };

    // Create the game instance
    const game = new Phaser.Game(config);

    // Global game variables
    game.globals = {
        // Game settings
        gameWidth: config.width,
        gameHeight: config.height,
        
        // Player settings
        playerSpeed: 300,
        jumpForce: -600,
        doubleJumpForce: -450,
        
        // Game state
        score: 0,
        highScore: 0,
        currentLevel: 1,
        
        // AdMob settings
        publisherId: 'ca-app-pub-9337140193574058~2326216750',
        adUnitId: 'ca-app-pub-9337140193574058/1621952240'
    };

    // Handle visibility change to pause game when tab/app is not active
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause game when not visible
            game.scene.getScenes(true).forEach(function(scene) {
                if (scene.scene.key === 'GameScene' && scene.scene.isActive()) {
                    scene.scene.pause();
                }
            });
        }
    });

    // Handle mobile device orientation changes
    window.addEventListener('resize', function() {
        game.scale.refresh();
    });
};
