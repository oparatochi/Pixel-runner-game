class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.highScore = this.scene.game.globals.highScore || 0;
        this.lastDistanceScore = 0;
    }
    
    updateScore(distanceScore) {
        // Only update distance score when it increases
        if (distanceScore > this.lastDistanceScore) {
            // Add the difference to the total score
            this.score += (distanceScore - this.lastDistanceScore);
            this.lastDistanceScore = distanceScore;
            
            // Update the scene's score
            this.scene.score = this.score;
        }
    }
    
    addCoinScore(value) {
        this.score += value;
        this.scene.score = this.score;
    }
    
    addBonusScore(value) {
        this.score += value;
        this.scene.score = this.score;
    }
    
    resetScore() {
        this.score = 0;
        this.lastDistanceScore = 0;
        this.scene.score = 0;
    }
    
    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.scene.game.globals.highScore = this.highScore;
            return true;
        }
        return false;
    }
}
