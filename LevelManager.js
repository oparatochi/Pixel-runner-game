class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.currentLevel = 1;
        this.platformPatterns = this.definePlatformPatterns();
        this.obstaclePatterns = this.defineObstaclePatterns();
        this.coinPatterns = this.defineCoinPatterns();
    }
    
    definePlatformPatterns() {
        // Define various platform patterns for level generation
        return [
            // Pattern 1: Straight platforms with small gaps
            {
                platformCount: 5,
                widthRange: [2, 4],
                gapRange: [1, 2],
                heightVariation: 0
            },
            // Pattern 2: Ascending platforms
            {
                platformCount: 4,
                widthRange: [2, 3],
                gapRange: [1, 2],
                heightVariation: -50
            },
            // Pattern 3: Descending platforms
            {
                platformCount: 4,
                widthRange: [2, 3],
                gapRange: [1, 2],
                heightVariation: 50
            },
            // Pattern 4: Varied height platforms
            {
                platformCount: 6,
                widthRange: [1, 3],
                gapRange: [1, 3],
                heightVariation: 'random'
            }
        ];
    }
    
    defineObstaclePatterns() {
        // Define obstacle placement patterns
        return [
            // Pattern 1: Single obstacle in middle
            {
                count: 1,
                positions: ['middle']
            },
            // Pattern 2: Two obstacles at edges
            {
                count: 2,
                positions: ['left', 'right']
            },
            // Pattern 3: Three obstacles spread out
            {
                count: 3,
                positions: ['left', 'middle', 'right']
            }
        ];
    }
    
    defineCoinPatterns() {
        // Define coin placement patterns
        return [
            // Pattern 1: Straight line
            {
                count: 5,
                arrangement: 'line',
                height: -50
            },
            // Pattern 2: Arc
            {
                count: 7,
                arrangement: 'arc',
                height: -70
            },
            // Pattern 3: Zigzag
            {
                count: 6,
                arrangement: 'zigzag',
                height: -60
            }
        ];
    }
    
    generateLevelSection(startX, baseY) {
        // Select a random platform pattern
        const platformPattern = Phaser.Utils.Array.GetRandom(this.platformPatterns);
        
        // Generate platforms according to pattern
        let currentX = startX;
        let currentY = baseY;
        const platforms = [];
        
        for (let i = 0; i < platformPattern.platformCount; i++) {
            // Determine platform width
            const width = Phaser.Math.Between(
                platformPattern.widthRange[0],
                platformPattern.widthRange[1]
            ) * 100;
            
            // Determine platform height variation
            if (platformPattern.heightVariation === 'random') {
                currentY += Phaser.Math.Between(-100, 100);
                // Keep within reasonable bounds
                currentY = Phaser.Math.Clamp(currentY, 300, 550);
            } else {
                currentY += platformPattern.heightVariation;
                // Keep within reasonable bounds
                currentY = Phaser.Math.Clamp(currentY, 300, 550);
            }
            
            // Create platform
            const platform = {
                x: currentX + (width / 2),
                y: currentY,
                width: width
            };
            
            platforms.push(platform);
            
            // Add gap before next platform
            const gap = Phaser.Math.Between(
                platformPattern.gapRange[0],
                platformPattern.gapRange[1]
            ) * 100;
            
            currentX += width + gap;
        }
        
        return {
            platforms: platforms,
            endX: currentX,
            endY: currentY
        };
    }
    
    placePlatforms(levelSection) {
        // Create actual platform sprites based on level section data
        const platforms = [];
        
        levelSection.platforms.forEach(platformData => {
            const platform = this.scene.platforms.create(
                platformData.x,
                platformData.y,
                'platform'
            );
            
            platform.setScale(platformData.width / 100, 2);
            platform.refreshBody();
            
            platforms.push(platform);
            
            // Randomly decide to place obstacles and coins
            if (Phaser.Math.Between(0, 10) > 7) {
                this.placeObstacles(platformData);
            }
            
            if (Phaser.Math.Between(0, 10) > 5) {
                this.placeCoins(platformData);
            }
        });
        
        return platforms;
    }
    
    placeObstacles(platformData) {
        // Select a random obstacle pattern
        const obstaclePattern = Phaser.Utils.Array.GetRandom(this.obstaclePatterns);
        
        // Place obstacles according to pattern
        for (let i = 0; i < obstaclePattern.count; i++) {
            let obstacleX;
            
            // Determine position based on pattern
            switch (obstaclePattern.positions[i % obstaclePattern.positions.length]) {
                case 'left':
                    obstacleX = platformData.x - (platformData.width / 3);
                    break;
                case 'middle':
                    obstacleX = platformData.x;
                    break;
                case 'right':
                    obstacleX = platformData.x + (platformData.width / 3);
                    break;
                default:
                    obstacleX = platformData.x;
            }
            
            // Create obstacle
            const obstacle = this.scene.obstacles.create(
                obstacleX,
                platformData.y - 40,
                'spike'
            );
            
            obstacle.setImmovable(true);
        }
    }
    
    placeCoins(platformData) {
        // Select a random coin pattern
        const coinPattern = Phaser.Utils.Array.GetRandom(this.coinPatterns);
        
        // Place coins according to pattern
        for (let i = 0; i < coinPattern.count; i++) {
            let coinX, coinY;
            
            // Determine position based on pattern
            switch (coinPattern.arrangement) {
                case 'line':
                    coinX = platformData.x - (platformData.width / 2) + (i * (platformData.width / (coinPattern.count - 1)));
                    coinY = platformData.y + coinPattern.height;
                    break;
                case 'arc':
                    // Create an arc pattern
                    const angle = (i / (coinPattern.count - 1)) * Math.PI;
                    coinX = platformData.x - (platformData.width / 2) + (i * (platformData.width / (coinPattern.count - 1)));
                    coinY = platformData.y + coinPattern.height - Math.sin(angle) * 50;
                    break;
                case 'zigzag':
                    // Create a zigzag pattern
                    coinX = platformData.x - (platformData.width / 2) + (i * (platformData.width / (coinPattern.count - 1)));
                    coinY = platformData.y + coinPattern.height + ((i % 2) * 30);
                    break;
                default:
                    coinX = platformData.x;
                    coinY = platformData.y + coinPattern.height;
            }
            
            // Create coin
            const coin = this.scene.coins.create(coinX, coinY, 'coin');
            coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
            coin.setCircle(12);
        }
    }
    
    increaseDifficulty() {
        // Increase difficulty based on current level or score
        // This could adjust platform gaps, obstacle frequency, etc.
        this.currentLevel++;
        
        // Example: Adjust platform patterns for higher difficulty
        if (this.currentLevel > 3) {
            // Make gaps wider
            this.platformPatterns.forEach(pattern => {
                if (pattern.gapRange[1] < 5) {
                    pattern.gapRange[1] += 0.5;
                }
            });
            
            // Make platforms narrower
            this.platformPatterns.forEach(pattern => {
                if (pattern.widthRange[0] > 1) {
                    pattern.widthRange[0] -= 0.5;
                }
            });
        }
    }
}
