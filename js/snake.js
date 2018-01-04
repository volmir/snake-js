
class Snake {

    //constructor() {
    init() {
        this.canvas = document.getElementById("snakeField");
        this.context = this.canvas.getContext("2d");

        this.canvas.onmousedown = this.canvasClick;

        this.gameStatus = 'play';

        this.blockSize = 20;
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

        this.snakeCoords = [];
    }

    getGameStatus() {
        return this.gameStatus;
    }

    startGame() {
        this.initSnakeStart();
        this.initApple();
        this.printApple();
        this.printSnake();
    }

    next() {
        if (this.gameStatus == 'pause') {
            return;
        }
        this.moveSnake();
        this.checkEatApple();
        this.checkBorders();
        if (this.gameStatus == 'play') {
            this.clearAll();
            this.printApple();
            this.printSnake();
        }
    }

    checkEatApple() {
        let headCoords = this.getHeadCoords();
        if (headCoords.x == this.apple.x
                && headCoords.y == this.apple.y) {
            this.snakeBody.push({
                x: this.apple.x,
                y: this.apple.y,
            });
            this.initApple();
        }
    }

    getHeadCoords() {
        return this.snakeBody.slice(0, 1)[0];
    }

    checkBorders() {
        let headCoords = this.getHeadCoords();
        if (headCoords.x < 0
                || headCoords.y < 0
                || headCoords.x > this.field.x - 1
                || headCoords.y > this.field.y - 1
                ) {
            this.gameStatus = 'game over';
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
            x: getFromTo(0, (this.field.x - 1)),
            y: getFromTo(0, (this.field.y - 1)),
        };
    }

    printApple() {
        this.printBlock('apple', this.apple.x, this.apple.y);
    }

    printSnake() {
        let block;
        for (block of this.snakeBody) {
            this.printBlock('snake', block.x, block.y);
        }
    }

    printBlock(type, posX, posY) {
        this.context.fillStyle = this.getBlockColor(type);
        this.context.fillRect(
                (posX * this.blockSize) + 1,
                (posY * this.blockSize) + 1,
                this.blockSize - 2,
                this.blockSize - 2,
                );
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

    canvasClick(e) {
        //console.log(e.offsetX, e.offsetY);

    }

    setKeyDown(key) {
        if (key == 'esc' || key == 'space') {
            if (this.gameStatus != 'pause') {
                this.gameStatus = 'pause';
            } else {
                this.gameStatus = 'play';
            }

        }

        if (this.directions.indexOf(key) != -1) {
            this.direction = key;
        }
    }

}
