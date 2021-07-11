class Button {
    constructor(text, x, y, w, h, fontSize, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.callback = callback;
        this.stroke = 0;
        this.fill = 255;
        this.text = text;
        this.fontSize = fontSize;
        this.shown = true;
    }

    Click() {
        this.callback();
    }

    CheckClick() {
        if (mouseX >= this.x-this.w/2 && mouseX <= this.x+this.w/2 && mouseY >= this.y-this.h/2 && mouseY <= this.y+this.h/2) {
            this.callback();
        }
    }

    Show() {
        this.shown = true;
        stroke(this.stroke);
        fill(this.fill);
        rect(this.x-this.w/2, this.y-this.h/2, this.w, this.h);
        textSize(this.fontSize);
        fill(0);
        noStroke();
        text(this.text, this.x, this.y);
    }
}