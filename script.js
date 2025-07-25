// Peaceful Aquarium Game - Main Game Logic
class AquariumGame {
    constructor() {
        this.money = 100;
        this.fish = [];
        this.waterQuality = 80;
        this.happiness = 85;
        this.lastFeedTime = Date.now();
        this.lastCleanTime = Date.now();
        
        this.fishTypes = [
            { emoji: '🐠', name: 'goldfish', cost: 30, happiness: 5 },
            { emoji: '🐟', name: 'tropical', cost: 50, happiness: 8 },
            { emoji: '🌺', name: 'angelfish', cost: 75, happiness: 12 }
        ];
        
        this.init();
        this.startGameLoop();
        this.createAmbientBubbles();
        this.addInitialFish();
    }
    
    init() {
        // Bind event listeners
        document.getElementById('feed-fish').addEventListener('click', () => this.feedFish());
        document.getElementById('clean-water').addEventListener('click', () => this.cleanWater());
        document.getElementById('add-decoration').addEventListener('click', () => this.addDecoration());
        
        // Shop event listeners
        document.querySelectorAll('.shop-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const fishType = e.currentTarget.dataset.fish;
                const cost = parseInt(e.currentTarget.dataset.cost);
                this.buyFish(fishType, cost);
            });
        });
        
        this.updateUI();
    }
    
    addInitialFish() {
        // Add 3 starting fish
        this.addFish('🐠', 'goldfish');
        this.addFish('🐟', 'tropical');
        this.addFish('🐠', 'goldfish');
    }
    
    addFish(emoji, type) {
        const fishContainer = document.querySelector('.fish-container');
        const fish = document.createElement('div');
        fish.className = 'fish';
        fish.innerHTML = emoji;
        fish.style.left = Math.random() * 700 + 'px';
        fish.style.top = Math.random() * 350 + 50 + 'px';
        
        // Add click interaction for fish
        fish.addEventListener('click', () => {
            this.petFish(fish);
        });
        
        fishContainer.appendChild(fish);
        
        this.fish.push({
            element: fish,
            type: type,
            emoji: emoji,
            lastFed: Date.now() - Math.random() * 60000,
            x: parseFloat(fish.style.left),
            y: parseFloat(fish.style.top),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            happiness: 80 + Math.random() * 20
        });
        
        this.animateFish(this.fish[this.fish.length - 1]);
    }
    
    animateFish(fish) {
        const animate = () => {
            // Smooth swimming animation
            fish.x += fish.vx;
            fish.y += fish.vy;
            
            // Bounce off walls
            if (fish.x <= 0 || fish.x >= 750) {
                fish.vx *= -1;
                fish.element.style.transform = fish.vx > 0 ? 'scaleX(1)' : 'scaleX(-1)';
            }
            if (fish.y <= 30 || fish.y >= 400) {
                fish.vy *= -1;
            }
            
            // Keep fish in bounds
            fish.x = Math.max(0, Math.min(750, fish.x));
            fish.y = Math.max(30, Math.min(400, fish.y));
            
            // Random direction changes for natural movement
            if (Math.random() < 0.02) {
                fish.vx += (Math.random() - 0.5) * 0.5;
                fish.vy += (Math.random() - 0.5) * 0.5;
                fish.vx = Math.max(-2, Math.min(2, fish.vx));
                fish.vy = Math.max(-2, Math.min(2, fish.vy));
            }
            
            fish.element.style.left = fish.x + 'px';
            fish.element.style.top = fish.y + 'px';
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    feedFish() {
        if (this.money < 5) {
            this.showNotification('Not enough money to feed fish!', 'error');
            return;
        }
        
        this.money -= 5;
        this.lastFeedTime = Date.now();
        
        // Create food particles
        this.createFoodParticles();
        
        // Make fish happy and animate them
        this.fish.forEach(fish => {
            fish.lastFed = Date.now();
            fish.happiness = Math.min(100, fish.happiness + 15);
            fish.element.classList.add('feeding');
            setTimeout(() => fish.element.classList.remove('feeding'), 500);
        });
        
        this.happiness = Math.min(100, this.happiness + 10);
        this.money += this.fish.length * 2; // Earn money from happy fish
        
        this.showNotification('Fish fed! They look happy! 🐠💖');
        this.updateUI();
    }
    
    createFoodParticles() {
        const aquarium = document.querySelector('.aquarium');
        const particles = ['🍤', '🌱', '🔴', '🟡', '🟢'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'food-particle';
                particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
                particle.style.left = Math.random() * 700 + 'px';
                particle.style.top = '30px';
                aquarium.appendChild(particle);
                
                setTimeout(() => particle.remove(), 3000);
            }, i * 100);
        }
    }
    
    cleanWater() {
        if (this.money < 10) {
            this.showNotification('Not enough money to clean water!', 'error');
            return;
        }
        
        this.money -= 10;
        this.waterQuality = Math.min(100, this.waterQuality + 30);
        this.lastCleanTime = Date.now();
        this.happiness = Math.min(100, this.happiness + 5);
        
        // Visual water cleaning effect
        this.createCleaningEffect();
        
        this.showNotification('Water cleaned! The aquarium sparkles! ✨');
        this.updateUI();
    }
    
    createCleaningEffect() {
        const aquarium = document.querySelector('.aquarium');
        const sparkles = ['✨', '💎', '⭐', '🌟'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'absolute';
                sparkle.style.left = Math.random() * 750 + 'px';
                sparkle.style.top = Math.random() * 450 + 'px';
                sparkle.style.fontSize = '20px';
                sparkle.style.animation = 'sparkle 1s ease-out forwards';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '10';
                sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
                
                // Add sparkle animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes sparkle {
                        0% { opacity: 0; transform: scale(0) rotate(0deg); }
                        50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
                        100% { opacity: 0; transform: scale(0) rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
                
                aquarium.appendChild(sparkle);
                setTimeout(() => {
                    sparkle.remove();
                    style.remove();
                }, 1000);
            }, i * 50);
        }
    }
    
    addDecoration() {
        if (this.money < 25) {
            this.showNotification('Not enough money for decorations!', 'error');
            return;
        }
        
        this.money -= 25;
        this.happiness = Math.min(100, this.happiness + 8);
        
        // Add a new decoration
        this.createRandomDecoration();
        
        this.showNotification('Beautiful decoration added! 🪸');
        this.updateUI();
    }
    
    createRandomDecoration() {
        const decorations = document.querySelector('.decorations');
        const decorTypes = ['🪸', '🌿', '🪨', '🐚', '⭐'];
        const decoration = document.createElement('div');
        
        decoration.style.position = 'absolute';
        decoration.style.bottom = '0px';
        decoration.style.left = Math.random() * 600 + 'px';
        decoration.style.fontSize = '30px';
        decoration.style.animation = 'sway 4s ease-in-out infinite';
        decoration.style.animationDelay = Math.random() * 2 + 's';
        decoration.innerHTML = decorTypes[Math.floor(Math.random() * decorTypes.length)];
        
        decorations.appendChild(decoration);
    }
    
    buyFish(fishType, cost) {
        if (this.money < cost) {
            this.showNotification('Not enough money for this fish!', 'error');
            return;
        }
        
        const fishData = this.fishTypes.find(f => f.name === fishType);
        if (!fishData) return;
        
        this.money -= cost;
        this.addFish(fishData.emoji, fishType);
        this.happiness = Math.min(100, this.happiness + fishData.happiness);
        
        this.showNotification(`New ${fishData.name} added to your aquarium! ${fishData.emoji}`);
        this.updateUI();
    }
    
    petFish(fishElement) {
        // Find the fish data
        const fishData = this.fish.find(f => f.element === fishElement);
        if (!fishData) return;
        
        // Happy animation
        fishElement.style.animation = 'none';
        fishElement.style.transform = 'scale(1.3) rotate(360deg)';
        fishElement.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            fishElement.style.transform = 'scale(1) rotate(0deg)';
            fishElement.style.animation = 'swim 8s ease-in-out infinite';
        }, 500);
        
        // Increase happiness and earn money
        fishData.happiness = Math.min(100, fishData.happiness + 5);
        this.happiness = Math.min(100, this.happiness + 2);
        this.money += 1;
        
        // Create heart effect
        this.createHeartEffect(fishElement);
        
        this.updateUI();
    }
    
    createHeartEffect(fishElement) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.left = fishElement.style.left;
        heart.style.top = fishElement.style.top;
        heart.style.fontSize = '16px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10';
        heart.style.animation = 'heart-float 1s ease-out forwards';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes heart-float {
                0% { opacity: 1; transform: translateY(0) scale(1); }
                100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
            }
        `;
        document.head.appendChild(style);
        
        document.querySelector('.fish-container').appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
            style.remove();
        }, 1000);
    }
    
    createAmbientBubbles() {
        const bubbleContainer = document.querySelector('.bubble-container');
        
        setInterval(() => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.width = bubble.style.height = Math.random() * 20 + 10 + 'px';
            bubble.style.animationDuration = Math.random() * 3 + 4 + 's';
            bubble.style.animationDelay = Math.random() * 2 + 's';
            
            bubbleContainer.appendChild(bubble);
            
            setTimeout(() => bubble.remove(), 8000);
        }, 1000);
    }
    
    startGameLoop() {
        setInterval(() => {
            this.updateGameState();
        }, 5000); // Update every 5 seconds
    }
    
    updateGameState() {
        const currentTime = Date.now();
        
        // Gradual water quality decrease
        if (currentTime - this.lastCleanTime > 30000) { // 30 seconds
            this.waterQuality = Math.max(0, this.waterQuality - 1);
        }
        
        // Fish get hungry over time
        this.fish.forEach(fish => {
            if (currentTime - fish.lastFed > 20000) { // 20 seconds
                fish.happiness = Math.max(0, fish.happiness - 1);
            }
        });
        
        // Update overall happiness based on fish happiness and water quality
        const avgFishHappiness = this.fish.length > 0 
            ? this.fish.reduce((sum, fish) => sum + fish.happiness, 0) / this.fish.length 
            : 50;
        
        this.happiness = Math.round((avgFishHappiness + this.waterQuality) / 2);
        
        // Passive income from happy fish
        if (this.happiness > 70) {
            this.money += Math.floor(this.fish.length * 0.5);
        }
        
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('money').textContent = this.money;
        document.getElementById('fish-count').textContent = this.fish.length;
        document.getElementById('happiness').textContent = Math.round(this.happiness) + '%';
        
        // Update water quality bar
        const qualityFill = document.getElementById('water-quality-fill');
        qualityFill.style.width = this.waterQuality + '%';
        
        // Change color based on quality
        if (this.waterQuality > 70) {
            qualityFill.style.background = 'linear-gradient(90deg, #4caf50, #8bc34a)';
        } else if (this.waterQuality > 40) {
            qualityFill.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
        } else {
            qualityFill.style.background = 'linear-gradient(90deg, #f44336, #e57373)';
        }
        
        // Update button states
        document.getElementById('feed-fish').disabled = this.money < 5;
        document.getElementById('clean-water').disabled = this.money < 10;
        document.getElementById('add-decoration').disabled = this.money < 25;
        
        // Update shop button states
        document.querySelectorAll('.shop-item').forEach(item => {
            const cost = parseInt(item.dataset.cost);
            item.disabled = this.money < cost;
        });
    }
    
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification show' + (type === 'error' ? ' error' : '');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AquariumGame();
});

// Add some peaceful background music (optional)
document.addEventListener('click', () => {
    // This would be where you could add ambient sounds
    // For now, we'll just add a subtle click sound effect through CSS transitions
}, { once: true });
