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

window.onload = function(){
    board = document.getElementById("board");

    // Calculate the appropriate canvas size based on viewport size
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var canvasSize = Math.min(viewportWidth, viewportHeight) * 0.9; // 90% of the smaller dimension
    var numBlocks = Math.floor(canvasSize / blockSize);

    board.height = numBlocks * blockSize;
    board.width = numBlocks * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    // Adjust rows and cols based on the new canvas size
    rows = numBlocks;
    cols = numBlocks;

    placeFood();
    document.addEventListener("keyup", changeDirection);
    addTouchControls();

    setInterval(update, 1000/10); //100 milliseconds
}

function update() {
    if(gameOver){
        return;
    }

    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY])
        placeFood();
    }

    for (let i = snakeBody.length-1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    if(snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows*blockSize){
        gameOver = true;
        alert("Game Over");
    }

    for(let i = 0; i < snakeBody.length; i++){
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver= true;
            alert("Game Over");
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function addTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    board.addEventListener("touchstart", function(event) {
        event.preventDefault();
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    });

    board.addEventListener("touchend", function(event) {
        event.preventDefault();
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleTouch();
    });

    function handleTouch() {
        let deltaX = touchEndX - touchStartX;
        let deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && velocityX != -1) {
                // Swipe Right
                velocityX = 1;
                velocityY = 0;
            } else if (deltaX < 0 && velocityX != 1) {
                // Swipe Left
                velocityX = -1;
                velocityY = 0;
            }
        } else {
            if (deltaY > 0 && velocityY != -1) {
                // Swipe Down
                velocityX = 0;
                velocityY = 1;
            } else if (deltaY < 0 && velocityY != 1) {
                // Swipe Up
                velocityX = 0;
                velocityY = -1;
            }
        }
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}