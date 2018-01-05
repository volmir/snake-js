
class Snake {

    init() {
        this.canvas = document.getElementById("snakeField");
        this.context = this.canvas.getContext("2d");

        this.gameStatus = 'play';

        this.blockSize = 25;
        this.field = {
            x: Math.floor(this.canvas.width / this.blockSize),
            y: Math.floor(this.canvas.height / this.blockSize)
        };

        this.snakeBody = [];

        this.speed = 500;

        this.directions = ['up', 'down', 'right', 'left'];
        this.direction = 'left';

        this.apple = {
            x: 0,
            y: 0,
        };

        this.scope = 0;
        
        this.snakeCoords = [];
    }

    startGame() {
        this.init();
        this.initSnakeStart();
        this.initApple();
        this.printApple();
        this.printSnake();
    }

    next() {
        if (this.gameStatus != 'play') {
            return;
        }
        this.moveSnake();
        this.checkBordersCollision();
        this.checkHeadOnCollision();
        this.checkEatApple();
        if (this.gameStatus == 'play') {
            this.clearAll();
            this.printApple();
            this.printSnake();
        }
    }

    checkEatApple() {
        let headCoords = this.getHeadCoords();
        if (headCoords.x == this.apple.x && headCoords.y == this.apple.y) {
            this.scope++;
            this.snakeBody.push(this.getTailCoords());
            this.initApple();
        }
    }

    getHeadCoords() {
        return this.snakeBody.slice(0, 1)[0];
    }
    
    getTailCoords() {
        return this.snakeBody.slice(-1)[0];
    }    

    checkHeadOnCollision() {
        let headCoords = this.getHeadCoords();
        let i = 0;
        for (let block of this.snakeBody) {
            if (i == 0) {
                i++;
                continue;
            }
            if (headCoords.x == block.x && headCoords.y == block.y) {
                this.gameOver();
            }
        }
    }
    
    checkBordersCollision() {
        let headCoords = this.getHeadCoords();
        if (headCoords.x < 0
                || headCoords.y < 0
                || headCoords.x > this.field.x - 1
                || headCoords.y > this.field.y - 1
                ) {
            this.gameOver();
        }
    }

    moveSnake() {
        let coord = {};
        let headCoords = this.getHeadCoords();

        switch (this.direction) {
            case 'up':
            {
                coord = {
                    x: headCoords.x,
                    y: headCoords.y - 1,
                }
                break;
            }
            case 'down':
            {
                coord = {
                    x: headCoords.x,
                    y: headCoords.y + 1,
                }
                break;
            }
            case 'left':
            {
                coord = {
                    x: headCoords.x - 1,
                    y: headCoords.y,
                }
                break;
            }
            case 'right':
            {
                coord = {
                    x: headCoords.x + 1,
                    y: headCoords.y,
                }
                break;
            }
            default:
            {
                break;
            }
        }

        this.snakeBody.unshift(coord);
        this.snakeBody.pop();
    }

    initSnakeStart() {
        let middleX = Math.floor(this.field.x / 2);
        let middleY = Math.floor(this.field.y / 2);

        for (let i = 0; i < 3; i++) {
            this.snakeBody.push({
                x: middleX + i,
                y: middleY
            });
        }

        this.direction = 'left';
    }

    initApple() {
        this.apple = {
            x: this.randFromTo(0, (this.field.x - 1)),
            y: this.randFromTo(0, (this.field.y - 1)),
        };
    }

    printApple() {
        this.printBlock('apple', this.apple.x, this.apple.y);
    }

    printSnake() {
        let i = 1;
        for (let block of this.snakeBody) {
            this.printBlock('snake', block.x, block.y, i);
            if (i == 1) {
                i--;
            }
        }
    }

    printBlock(type, posX, posY, isHead = 0) {
        this.context.fillStyle = this.getBlockColor(type);
        this.context.fillRect(
                (posX * this.blockSize) + 1,
                (posY * this.blockSize) + 1,
                this.blockSize - 2,
                this.blockSize - 2,
                );
                
        if (isHead == 1) {
            let padding = Math.round(this.blockSize / 4); 
            this.context.fillStyle = "rgb(128,149,255)";
            this.context.fillRect(
                    (posX * this.blockSize) + padding,
                    (posY * this.blockSize) + padding,
                    padding * 2,
                    padding * 2,
                    );
        }
    }

    getBlockColor(type) {
        let color;
        if (type == 'apple') {
            color = "rgb(255,34,30)";
        } else {
            color = "rgb(0,38,255)";
        }

        return color;
    }

    clearAll() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    mouseClick(x, y) {
        if (this.gameStatus == 'startup') {
            this.clearAll();
            setTimeout(this.startGame(), 500);
        }
        if (this.gameStatus == 'pause') {
            this.stopPaused();
        }
    }

    setKeyDown(keyCode) {
        let key = '';

        if (keyCode == 38) {
            key = 'up';
        }
        if (keyCode == 40) {
            key = 'down';
        }
        if (keyCode == 37) {
            key = 'left';
        }
        if (keyCode == 39) {
            key = 'right';
        }
        if (keyCode == 27) {
            key = 'esc';
        }
        if (keyCode == 32) {
            key = 'space';
        }

        if ((key == 'esc' || key == 'space') && this.gameStatus == 'play') {
            this.startPaused();
        } else if ((key == 'esc' || key == 'space') && this.gameStatus == 'pause') {
            this.stopPaused();
        }
        
        if (key == 'space' && this.gameStatus == 'game over') {
            this.clearAll();
            setTimeout(this.startGame(), 500);
        }   

        if (this.gameStatus == 'startup') {
            this.clearAll();
            setTimeout(this.startGame(), 500);
        }
    
        if (this.directions.indexOf(key) != -1) {
            if ((this.direction == 'up' || this.direction == 'down') 
                    && (key == 'left' || key == 'right')) {
                this.direction = key;
            } else if ((this.direction == 'left' || this.direction == 'right') 
                    && (key == 'up' || key == 'down')) {
                this.direction = key;
            }
        }
    }

    startupScreen() {
        this.init();
        this.gameStatus = 'startup';
        
        this.fillField();
        
        this.context.font = "bold 30px Verdana,sans-serif";
        this.context.fillStyle = "black";
        this.context.fillText(
                "SNAKE",
                Math.round(this.canvas.width / 2) - 55,
                Math.round(this.canvas.height / 2) - 30,
                );
                
        this.context.font = "18px Verdana,sans-serif";
        this.context.fillStyle = "black";
        this.context.fillText(
                "Press any key to start game",
                Math.round(this.canvas.width / 2) - 120,
                Math.round(this.canvas.height / 2),
                );                
       
    }

    gameOver() {
        this.gameStatus = 'game over';

        this.fillField();

        this.context.font = "bold 30px Verdana,sans-serif";
        this.context.lineWidth = 2;
        this.context.strokeStyle = "black";
        this.context.strokeText(
                "Game Ower",
                Math.round(this.canvas.width / 2) - 80,
                Math.round(this.canvas.height / 2) - 50,
                );
                
        this.context.font = "bold 18px Verdana,sans-serif";
        this.context.fillStyle = "black";
        this.context.fillText(
                "Your result: " + this.scope,
                Math.round(this.canvas.width / 2) - 50,
                Math.round(this.canvas.height / 2) - 15,
                );                
                
        this.context.font = "15px Verdana,sans-serif";
        this.context.fillStyle = "black";
        this.context.fillText(
                "Press \"Space\" for start new game",
                Math.round(this.canvas.width / 2) - 110,
                Math.round(this.canvas.height / 2) + 35,
                );                 
    }

    startPaused() {
        this.gameStatus = 'pause';

        this.fillField();

        this.context.font = "bold 30px Verdana,sans-serif";
        this.context.lineWidth = 2;
        this.context.strokeStyle = "black";
        this.context.strokeText(
                "Paused",
                Math.round(this.canvas.width / 2) - 45,
                Math.round(this.canvas.height / 2) - 15,
                );
    }

    stopPaused() {
        this.gameStatus = 'play';
    }

    fillField() {
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(this.canvas.width, 0);
        this.context.closePath();
        this.context.fillStyle = "rgba(100,150,185,0.3)";
        this.context.fill();
        this.context.stroke();
    }

    randFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
}
