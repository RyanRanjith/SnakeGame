//board
var blockSize;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX;
var snakeY;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;

var gameOver = false;

// touch control variables
var startX, startY, endX, endY;

// Margin size (in pixels)
var margin = 20;

window.onload = function() {
    board = document.getElementById("board");
    context = board.getContext("2d"); //used for drawing on the board

    document.addEventListener("keyup", changeDirection);

    // touch event listeners
    board.addEventListener("touchstart", handleTouchStart, false);
    board.addEventListener("touchmove", handleTouchMove, false);

    window.addEventListener("resize", resizeCanvas, false); // Resize canvas when the window is resized

    initializeGame();
    setInterval(update, 1000 / 10); //100 milliseconds
}

function initializeGame() {
    resizeCanvas();
    placeFood();
    resetSnake();
}

function resetSnake() {
    snakeX = blockSize * 5 + margin;
    snakeY = blockSize * 5 + margin;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    gameOver = false;
}

function resizeCanvas() {
    board.width = window.innerWidth - margin * 2;
    board.height = window.innerHeight - margin * 2;
    blockSize = Math.min((board.width - margin * 2) / cols, (board.height - margin * 2) / rows);
    resetSnake();
    placeFood();
}

function update() {
    if (gameOver) {
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    if (snakeX < margin || snakeX >= board.width + margin || snakeY < margin || snakeY >= board.height + margin) {
        gameOver = true;
        alert("Game Over");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function handleTouchStart(e) {
    const firstTouch = e.touches[0];
    startX = firstTouch.clientX;
    startY = firstTouch.clientY;
}

function handleTouchMove(e) {
    if (!startX || !startY) {
        return;
    }

    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;

    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (diffX < 0 && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        }
    } else {
        if (diffY > 0 && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (diffY < 0 && velocityY != 1) {
            velocityX = 0;
            velocityY = -1;
        }
    }

    startX = null;
    startY = null;
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize + margin;
    foodY = Math.floor(Math.random() * rows) * blockSize + margin;
}