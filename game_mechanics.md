# Game Mechanics Design Document

## Character Controls

### Movement Mechanics
- **Auto-Run**: Character automatically moves forward at a constant speed
- **Jump**: 
  - Single tap for standard jump
  - Height determined by tap duration (longer press = higher jump)
  - Maximum jump height capped for balanced gameplay
- **Double Jump**: 
  - Second tap while in mid-air performs double jump
  - Slightly lower height than first jump
  - Useful for reaching higher platforms or avoiding obstacles
- **Slide**: 
  - Swipe down to slide under obstacles
  - Character maintains hitbox reduction during slide
  - Slide duration is fixed (approximately 1 second)

### Character States
- **Running**: Default state
- **Jumping**: Triggered by tap
- **Double Jumping**: Triggered by second tap while in air
- **Sliding**: Triggered by swipe down
- **Falling**: When character drops from platform
- **Hit**: When character collides with obstacle (brief invulnerability follows)

## Level Design

### Level Structure
- **Level Types**:
  - Tutorial Levels: Introduce game mechanics gradually
  - Standard Levels: Balanced challenge with varied obstacles
  - Challenge Levels: Higher difficulty with complex obstacle patterns
  - Bonus Levels: Special themes with unique mechanics

### Platform Types
- **Static Platforms**: Standard non-moving surfaces
- **Moving Platforms**: 
  - Horizontal movement (left-right)
  - Vertical movement (up-down)
  - Circular movement patterns
- **Disappearing Platforms**: Vanish shortly after player lands on them
- **Bouncy Platforms**: Provide extra jump height
- **Slippery Platforms**: Reduced traction, harder to control jumps

### Obstacle Types
- **Static Obstacles**:
  - Spikes: Instant damage on contact
  - Walls: Must be jumped over
  - Gaps: Must be jumped across
- **Moving Obstacles**:
  - Swinging pendulums
  - Moving spike blocks
  - Falling rocks
- **Timed Obstacles**: Activate and deactivate in patterns
- **Triggered Obstacles**: Activate when player approaches

## Collectibles System

### Coins
- **Regular Coins**: +10 points
- **Silver Coins**: +50 points
- **Gold Coins**: +100 points
- **Coin Patterns**: Strategic placement to guide player movement

### Power-ups
- **Shield**:
  - Duration: 10 seconds
  - Effect: Protects from one hit
  - Visual: Character glows blue
- **Magnet**:
  - Duration: 8 seconds
  - Effect: Attracts coins within radius
  - Visual: Coins visibly pulled toward player
- **Speed Boost**:
  - Duration: 5 seconds
  - Effect: Increases movement speed by 30%
  - Visual: Motion blur effect
- **High Jump**:
  - Duration: 7 seconds
  - Effect: Increases jump height by 40%
  - Visual: Character trails green particles

## Scoring System

### Point Sources
- **Coins**: Various point values based on type
- **Distance**: 1 point per meter traveled
- **Enemies Defeated**: 25 points per enemy
- **Time Bonus**: (Level par time - completion time) × 10
- **Perfect Run Bonus**: +500 points for no deaths

### Multipliers
- **Combo System**: Consecutive coin collection increases multiplier
- **Risk-Reward**: Bonus multipliers for taking dangerous paths

## Progression System

### Level Unlocking
- **Star Rating**: 1-3 stars based on performance
- **Unlock Requirements**: Minimum star count to unlock new levels
- **Level Groups**: Themed worlds with 10 levels each

### Character Progression
- **Starting Character**: Basic abilities
- **Unlockable Characters**: 
  - Unique abilities (higher jump, faster speed, etc.)
  - Visual differences
  - Unlock via level completion or achievement milestones

## Difficulty Curve

### Progression Factors
- **Obstacle Complexity**: Increases with level progression
- **Timing Precision**: More precise timing required in later levels
- **Platform Challenges**: More complex platform arrangements
- **Enemy Behavior**: More sophisticated patterns

### Balancing Elements
- **Checkpoint Frequency**: Decreases in higher levels
- **Power-up Availability**: Strategic placement based on difficulty
- **Learning Curve**: New mechanics introduced gradually
- **Difficulty Spikes**: Controlled to prevent player frustration
