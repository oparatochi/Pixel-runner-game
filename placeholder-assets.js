// Basic placeholder images for the game
const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');

// Player placeholder
ctx.fillStyle = '#3498db';
ctx.fillRect(0, 0, 32, 32);
ctx.fillStyle = '#2980b9';
ctx.fillRect(8, 8, 16, 24);

const playerDataURL = canvas.toDataURL();

// Platform placeholder
ctx.clearRect(0, 0, 32, 32);
ctx.fillStyle = '#27ae60';
ctx.fillRect(0, 0, 32, 8);

const platformDataURL = canvas.toDataURL();

// Coin placeholder
ctx.clearRect(0, 0, 32, 32);
ctx.fillStyle = '#f1c40f';
ctx.beginPath();
ctx.arc(16, 16, 8, 0, Math.PI * 2);
ctx.fill();

const coinDataURL = canvas.toDataURL();

// Spike placeholder
ctx.clearRect(0, 0, 32, 32);
ctx.fillStyle = '#e74c3c';
ctx.beginPath();
ctx.moveTo(16, 0);
ctx.lineTo(32, 32);
ctx.lineTo(0, 32);
ctx.closePath();
ctx.fill();

const spikeDataURL = canvas.toDataURL();

// Background placeholder
ctx.clearRect(0, 0, 32, 32);
ctx.fillStyle = '#3498db';
ctx.fillRect(0, 0, 32, 32);
ctx.fillStyle = '#2980b9';
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        if ((i + j) % 2 === 0) {
            ctx.fillRect(i * 8, j * 8, 8, 8);
        }
    }
}

const backgroundDataURL = canvas.toDataURL();

// Button placeholder
ctx.clearRect(0, 0, 32, 32);
ctx.fillStyle = '#9b59b6';
ctx.fillRect(0, 0, 32, 32);
ctx.fillStyle = '#8e44ad';
ctx.fillRect(2, 2, 28, 28);

const buttonDataURL = canvas.toDataURL();

// Export the data URLs
window.gameAssets = {
    player: playerDataURL,
    platform: platformDataURL,
    coin: coinDataURL,
    spike: spikeDataURL,
    background: backgroundDataURL,
    button: buttonDataURL
};
