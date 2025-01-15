const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
const box = 20; // Snake size
const canvasSize = 400;
let snake = [{ x: box * 5, y: box * 5 }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score from localStorage
let isPaused = false;

// Display the high score
document.getElementById("highScore").textContent = highScore;

// Event listeners for buttons
document.getElementById("upBtn").addEventListener("click", () => changeDirection("UP"));
document.getElementById("downBtn").addEventListener("click", () => changeDirection("DOWN"));
document.getElementById("leftBtn").addEventListener("click", () => changeDirection("LEFT"));
document.getElementById("rightBtn").addEventListener("click", () => changeDirection("RIGHT"));
document.getElementById("pauseBtn").addEventListener("click", togglePause);

function gameLoop() {
    if (isPaused) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Move the snake
    const head = { ...snake[0] };
    switch (direction) {
        case "UP": head.y -= box; break;
        case "DOWN": head.y += box; break;
        case "LEFT": head.x -= box; break;
        case "RIGHT": head.x += box; break;
    }
    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        food = spawnFood();
    } else {
        snake.pop(); // Remove tail
    }

    // Check collision with walls or itself
    if (checkCollision(head)) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // Save the high score to localStorage
            alert(`Game Over! You beat the high score! New high score: ${highScore}`);
        } else {
            alert(`Game Over! Your score: ${score}`);
        }
        resetGame();
    }

    // Draw the snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, box, box);
    });
}

// Spawn food at a random location
function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

// Check collision with walls or itself
function checkCollision(head) {
    // Collision with walls
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }
    // Collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Change direction of the snake
function changeDirection(newDirection) {
    if (isPaused) return;

    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
    if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// Pause or resume the game
function togglePause() {
    isPaused = !isPaused;
    document.getElementById("pauseBtn").textContent = isPaused ? "Resume" : "Pause";
}

// Reset the game
function resetGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").textContent = score;
    food = spawnFood();
}

// Run the game loop every 100ms
setInterval(gameLoop, 100);
