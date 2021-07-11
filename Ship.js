class Battleship {
    constructor(x, y, w, h, num, col) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.clicked = false;
        this.num = num;
        this.col = col;
    }

    show() {
        for (let x = 0; x<this.w; x++) {
            for (let y = 0; y<this.h; y++) {
                stroke(0);
                fill(this.col, 100, 100);
                rect(this.x+x*game.boards[0].size, this.y+y*game.boards[0].size, game.boards[0].size, game.boards[0].size);
            }
        }
    }

    place(x, y) {
        this.remove();
        this.x = x*game.boards[0].size + game.boards[0].offsetX;
        this.y = y*game.boards[0].size + game.boards[0].offsetY;
        for (let x1 = 0; x1<this.w; x1++) {
            for (let y1 = 0; y1<this.h; y1++) {
                pg.field[y+y1][x+x1] = this.num;
            }
        }
    }

    remove() {
        for (let x1 = 0; x1<pg.field.length; x1++) {
            for (let y1 = 0; y1<pg.field[x1].length; y1++) {
                if (pg.field[y1][x1] === this.num) pg.field[y1][x1] = "";
            }
        }
    }

    released() {
        this.clicked = false;
        if (
            this.x >= game.boards[0].offsetX &&
            this.x <= game.boards[0].offsetX+10*game.boards[0].size &&
            this.y >= game.boards[0].offsetY &&
            this.y <= game.boards[0].offsetY+10*game.boards[0].size
        ) {
            let x = this.x - game.boards[0].offsetX;
            let y = this.y - game.boards[0].offsetY;
            x = floor(x/game.boards[0].size);
            y = floor(y/game.boards[0].size);
            for (let x1 = 0; x1<this.w; x1++) {
                for (let y1 = 0; y1<this.h; y1++) {
                    try {
                        if (pg.field[y+y1][x+x1] !== "") {
                            this.x = this.baseX;
                            this.y = this.baseY;
                            this.remove();
                            return;
                        }
                    }
                    catch {
                        this.x = this.baseX;
                        this.y = this.baseY;
                        this.remove();
                        return;
                    }
                }
            }
            this.place(x, y);
        }
        else {
            this.x = this.baseX;
            this.y = this.baseY;
            this.remove();
        }
    }

    checkClicked() {
        if (
            mouseX >= this.x && 
            mouseX <= this.x+this.w*game.boards[0].size &&
            mouseY >= this.y &&
            mouseY <= this.y+this.h*game.boards[0].size
        ) {
            this.clicked = true;
        }
    }

    update() {
        if (this.clicked === true) {
            this.x = mouseX;
            this.y = mouseY;
        }
    }
}