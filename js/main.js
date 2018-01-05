
'use strict';

let snake = new Snake();

window.onload = function () {
    snake.startupScreen();

    let gameProcess = setInterval(function () {
        snake.next();
    }, snake.speed);

    window.onkeydown = processKey;
    snake.canvas.onmousedown = canvasClick;
}

function processKey(e) {
    if (e.keyCode > 0) {
        snake.setKeyDown(e.keyCode);
    }
}
function canvasClick(e) {
    snake.mouseClick(e.offsetX, e.offsetY);
}

