
'use strict';

let snake = new Snake(); 

window.onload = function () {
    snake.init();
    snake.startGame();
    let gameStatus = snake.getGameStatus();

    let gameProcess = setInterval(function () {
        gameStatus = snake.getGameStatus();
        if (gameStatus == 'game over') {
            clearInterval(gameProcess);
        } else {
            snake.next();
        }
    }, snake.speed);

//    setTimeout(function () {
//        clearInterval(gameProcess);
//        snake.clearAll();
//    }, 5000);


    window.onkeydown = processKey;
}

    function processKey(e) {
        let key = '';

        if (e.keyCode == 38) {
            key = 'up';
        }
        if (e.keyCode == 40) {
            key = 'down';
        }
        if (e.keyCode == 37) {
            key = 'left';
        }
        if (e.keyCode == 39) {
            key = 'right';
        }
        if (e.keyCode == 27) {
            key = 'esc';
        }
        if (e.keyCode == 32) {
            key = 'space';
        }
        
        if (key.length) {
            snake.setKeyDown(key);
        }
    }


