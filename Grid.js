class Grid {
    show(gridX, gridY, size) {
        for (let x = 0; x<10; x++) {
            for (let y = 0; y<10; y++) {
                stroke(0);
                strokeWeight(2);
                noFill();
                rect(x*size+gridX, y*size+gridY, size, size);
            }
        }
    }
}