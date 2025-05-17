class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load minimal assets needed for the preloader
        this.load.image('logo', 'assets/images/logo-placeholder.png');
        this.load.image('loading-bar', 'assets/images/loading-bar.png');
    }

    create() {
        // Set up any game settings that need to be established before the game starts
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // Initialize any global systems
        console.log('Boot scene complete, transitioning to Preloader');
        
        // Transition to the preloader scene
        this.scene.start('PreloaderScene');
    }
}
