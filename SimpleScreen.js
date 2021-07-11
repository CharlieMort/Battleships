class Simple {
    constructor(text, size) {
        this.text = text;
        this.size = size;
    }

    show() {
        fill(0);
        textSize(this.size);
        text(this.text, width/2, height/2);
    }
}