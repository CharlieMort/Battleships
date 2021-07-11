let g;

let stages = ["pg", "pgt", "g", "o"]
let stageIndex = 0;

let pg = {
    ships: [],
    field: [
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""]
    ]
}

let pgt = {
    text: "Game Starting",
    visual: "",
    countdownTimer: 0,
    startCountdown: true,
    maxTime: 2000
}

let playerIndex = 0;

let game = {
    turn: 0,
    boards: [],
    winner: 2,
    players: [
        {
            ships: undefined,
            grid: undefined,
            hits: [[1,1],[1,2],[2,1],[1,3],[4,4]],
            hitCounter: 0
        },
        {
            ships: undefined,
            grid: undefined,
            hits: [],
            hitCounter: 0
        }
    ]
}

let button;
let restartButton;
let colors = [0, 50, 100, 150, 200]

function setup() {
    createCanvas(windowWidth, windowHeight);

    game.boards = [
        {
            offsetX: (windowWidth/2)-((windowWidth/40)*12),
            offsetY: (windowHeight/2)-((windowWidth/40)*5),
            size: (windowWidth/40)
        },
        {
            offsetX: windowWidth/2+((windowWidth/40)*2),
            offsetY: windowHeight/2-((windowWidth/40)*5),
            size: windowWidth/40
        }
    ]

    background(255);
    textAlign(CENTER, CENTER);
    g = new Grid();
    Start();
    
    pgt.visual = new Simple(pgt.text, 50);

    button = new Button("Set", width/2, height/2, 50, 30, 20, () => {
        game.players[playerIndex].ships = [...pg.field];
        stageIndex++;
    });

    restartButton = new Button("Restart", width/2, height/2+100, 100, 60, 30, () => {
        stageIndex = 0;
        Start();
    })

    game.players[playerIndex].grid = new Grid();
    game.players[playerIndex===0?1:0].grid = new Grid();
    game.players[playerIndex===0?1:0].ships = [
        ["","","","","","","","","",""],
        ["","1","","5","5","5","5","5","",""],
        ["","1","","","","","","","",""],
        ["","1","","","","","","","",""],
        ["","1","","2","2","2","","","",""],
        ["","","","","","","3","","",""],
        ["","","","4","","","3","","",""],
        ["","","","4","","","","","",""],
        ["","","","4","","","","","",""],
        ["","","","","","","","","",""]
    ];
}

function Start() {
    pgt = {
        text: "Game Starting",
        visual: "",
        countdownTimer: 0,
        startCountdown: true,
        maxTime: 2000
    }

    game.players.map((player) => {
        player.hitCounter = 0;
        player.hits = [];
        player.ships = [
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""],
            ["","","","","","","","","",""]
        ];
    })
    let _offsetX = game.boards[0].offsetX;
    let _offsetY = game.boards[0].offsetY;
    let s = game.boards[0].size;
    pg.ships[0] = new Battleship(_offsetX-3*s, _offsetY, 1, 4, 1, colors[0]);
    pg.ships[1] = new Battleship(_offsetX-1.5*s, _offsetY, 1, 2, 2, colors[1]);
    pg.ships[2] = new Battleship(_offsetX-1.5*s, _offsetY+s*3, 1, 3, 3, colors[2]);
    pg.ships[3] = new Battleship(_offsetX-3*s, _offsetY+s*5, 1, 5, 4, colors[3]);
    pg.ships[4] = new Battleship(_offsetX-1.5*s, _offsetY+s*7, 1, 3, 5, colors[4]);
}

function draw() {
    colorMode(HSB);
    switch(stages[stageIndex]) {
        case "pg":
            PreGame();
            break;
        case "pgt":
            PreGameTransition();
            break;
        case "g":
            Game();
            break;
        case "o":
            EndScreen();
            break;
    }
}

function mouseClicked() {
    switch(stages[stageIndex]) {
        case "pg":
            if (button.shown) button.CheckClick();
            break;
        case "g":
            if (game.turn === playerIndex) {
                Shoot(game.boards[1].offsetX, game.boards[1].offsetY, game.boards[1].size);
            }
            break;
        case "o":
            restartButton.CheckClick();
            break;
    }
}

function mousePressed() {
    switch(stages[stageIndex]) {
        case "pg":
            pg.ships.map(ship => ship.checkClicked());
            break;
    }
}

function mouseReleased() {
    pg.ships.map(ship => {
        if (ship.clicked) ship.released()
    })
}

function PreGame() {
    background(100);
    g.show(game.boards[0].offsetX, game.boards[0].offsetY, game.boards[0].size);
    let placed = true;
    pg.ships.map((ship) => {
        ship.show();
        ship.update();
        if ((ship.x === ship.baseX && ship.y === ship.baseY) || ship.clicked) {
            placed = false;
            button.shown = false;
        }
    })
    if (placed) {
        button.shown = true;
        button.Show();
    }
}

function PreGameTransition() {
    background(255);
    pgt.visual.show();
    if (pgt.startCountdown) {
        pgt.countdownTimer += deltaTime;
        if (pgt.countdownTimer >= pgt.maxTime) {
            stageIndex ++;
        }
    }
}

function Game() {
    background(255);
    textSize(50);
    fill(0);
    text(game.turn === playerIndex ? "Your Turn" : "Oppenents Turn", width/2, height/2-game.boards[0].size*7);
    game.players[playerIndex].grid.show(game.boards[0].offsetX, game.boards[0].offsetY, game.boards[0].size);
    game.players[playerIndex===0?1:0].grid.show(game.boards[1].offsetX, game.boards[1].offsetY, game.boards[1].size);
    ShowShips(game.players[playerIndex].ships, game.boards[0].offsetX, game.boards[0].offsetY, game.boards[0].size);
    ShowHits(game.players[playerIndex===0?1:0].ships, game.players[playerIndex].hits, game.boards[1].offsetX, game.boards[1].offsetY, game.boards[1].size);
    ShowHits(game.players[playerIndex].ships, game.players[playerIndex===0?1:0].hits, game.boards[0].offsetX, game.boards[0].offsetY, game.boards[0].size);
    if (game.turn !== playerIndex) {
        game.players[1].hits.push([floor(random(0,10)), floor(random(0,10))]);
        game.turn = 0;
    }
    game.winner = DetermineWinner();
    if (game.winner !== 2) {
        stageIndex ++;
    }
}

function EndScreen() {
    background(255);
    textSize(75);
    text(playerIndex===game.winner?"You Won!!":"You Lost :(", width/2, height/2);
    restartButton.Show();
}

function ShowShips(ships, offsetX, offsetY, size) {
    for (let y = 0; y<10; y++) {
        for (let x = 0; x<10; x++) {
            if (ships[y][x] !== "") {
                fill(colors[ships[y][x]-1], 100, 100);
                rect(x*size+offsetX, y*size+offsetY, size, size);
            }
        }
    }
}

function ShowHits(ships, hits, offsetX, offsetY, size) {
    hits.map((hit) => {
        if (ships[hit[1]][hit[0]] !== "") {
            fill(colors[ships[hit[1]][hit[0]]-1], 100, 100);
            rect(hit[0]*size+offsetX, hit[1]*size+offsetY, size, size);
            DrawHit(hit[0]*size+offsetX, hit[1]*size+offsetY, game.boards[1].size/2);
        }
        else {
            DrawMiss(hit[0]*size+offsetX, hit[1]*size+offsetY, game.boards[1].size/2);
        }
    })
}

function DrawHit(x, y, size) {
    fill(0, 100, 100);
    stroke(0);
    ellipse(x+size, y+size, size);
}

function DrawMiss(x, y, size) {
    fill(0);
    stroke(0);
    ellipse(x+size, y+size, size);
}

function Shoot(offsetX, offsetY, size) {
    if (
        mouseX >= offsetX &&
        mouseX <= offsetX+10*size &&
        mouseY >= offsetY &&
        mouseY <= offsetY+10*size
    ) {
        let x = floor((mouseX-offsetX)/size);
        let y = floor((mouseY-offsetY)/size);
        for (let hit of game.players[game.turn].hits) {
            if (hit[0] === x && hit[1] === y) return;
        }
        if (game.players[game.turn===0?1:0].ships[y][x] !== "") {
            game.players[game.turn].hitCounter ++;
            console.log("HIT");
        }
        game.players[game.turn].hits.push([x, y]);
        game.turn = game.turn===0?1:0;
    }
}

function DetermineWinner() {
    if (game.players[0].hitCounter >= 17) {
        return 0;
    }
    if (game.players[1].hitCounter >= 17) {
        return 1;
    }
    return 2;
}

function keyPressed() {
    if (key === "r" && stages[stageIndex] === "pg") {
        pg.ships.map((ship) => {
            if (ship.clicked) {
                let w = ship.w;
                ship.w = ship.h;
                ship.h = w;
            }
        })
    } 
}