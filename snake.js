//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0; 

var snakeBody = [];

//food
var foodX;
var foodY;

var gameOver = false;

// touch control variables
var startX, startY, endX, endY;

window.onload = function() {
    board = document.getElementById("board");
    resizeCanvas();
    context = board.getContext("2d"); //used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);

    // touch event listeners
    board.addEventListener("touchstart", handleTouchStart, false);
    board.addEventListener("touchmove", handleTouchMove, false);

    window.addEventListener("resize", resizeCanvas, false); // Resize canvas when the window is resized

    setInterval(update, 1000 / 10); //100 milliseconds
}

function resizeCanvas() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    // Adjust the size of the snake and the grid based on the new size
    blockSize = Math.min(board.width / cols, board.height / rows);
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
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
        snakeBody.push([foodX, foodY])
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
    if (snakeX < 0 || snakeX > board.width || snakeY < 0 || snakeY > board.height) {
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
    console.log("Key pressed: " + e.code);
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
    console.log("Touch start detected");
    const firstTouch = e.touches[0];
    startX = firstTouch.clientX;
    startY = firstTouch.clientY;
    console.log("Touch start position: ", startX, startY);
}

function handleTouchMove(e) {
    console.log("Touch move detected");
    if (!startX || !startY) {
        return;
    }

    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
    console.log("Touch move position: ", endX, endY);

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
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}