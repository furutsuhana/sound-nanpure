// p5.js version of Sound Nanpure (mp3 edition)

/* ========= グローバル ========= */
let masume, heya;
let hold = false;
let holdkeep = true;
let holdred = false;
let holdyellow = false;
let holdgreen = false;
let holdblue = false;
let count = 0;
let started = false;

let b1, b2, b3, b4;
let easyBtn, answerBtn;
let m = [];
let cursor;

let img;
let doSound, reSound, miSound, faSound;
let seikaiSound, fuseikaiSound;

/* ========= preload ========= */
function preload() {
  img = loadImage("opening.jpeg");
  doSound = loadSound("sounds/do.mp3");
  reSound = loadSound("sounds/re.mp3");
  miSound = loadSound("sounds/mi.mp3");
  faSound = loadSound("sounds/fa.mp3");
  seikaiSound = loadSound("sounds/seikai.mp3");
  fuseikaiSound = loadSound("sounds/fuseikai.mp3");
}

/* ========= setup ========= */
function setup() {
  createCanvas(800, 800);

  masume = new Masume();
  heya = new Heya();
  heya.setQuestion();
  heya.setAnswer();

  b1 = new Button(50, 50, 100, 100);
  b2 = new Button(250, 50, 100, 100);
  b3 = new Button(450, 50, 100, 100);
  b4 = new Button(650, 50, 100, 100);

  for (let a = 0; a < 4; a++) {
    m[a] = [];
    for (let b = 0; b < 4; b++) {
      m[a][b] = new Button(100 * a + 200, 100 * b + 200, 100, 100);
    }
  }

  easyBtn = new Button(50, 650, 300, 100);
  answerBtn = new Button(450, 650, 300, 100);

  cursor = new Cursor();
}

/* ========= draw ========= */
function draw() {
  if (!started) {
    image(img, 0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Click or Press SPACE to start", width / 2, height - 60);
    return;
  }

  background(255);
  masume.display();
  heya.drawFixedCells();
  heya.drawInputs(easyBtn.judge(mouseX, mouseY), hold);
  heya.checkAnswer(answerBtn.judge(mouseX, mouseY), hold);
  
  if (heya.checked) {
    if (heya.correctCount === 16) {
      seikaiSound.play();
      noLoop();
    } else {
      fuseikaiSound.play();
      noLoop();
    }
  }

  if (hold) {
    if (b1.judge(mouseX, mouseY)) { doSound.play(); holdred = true; }
    else if (b2.judge(mouseX, mouseY)) { reSound.play(); holdyellow = true; }
    else if (b3.judge(mouseX, mouseY)) { miSound.play(); holdgreen = true; }
    else if (b4.judge(mouseX, mouseY)) { faSound.play(); holdblue = true; }

    for (let a = 0; a < 4; a++) {
      for (let b = 0; b < 4; b++) {
        if (m[a][b].judge(mouseX, mouseY)) {
          heya.playCellSound(a, b);
        }
      }
    }
  }

  hold = false;

  if (holdred) handleInput(1);
  else if (holdyellow) handleInput(2);
  else if (holdgreen) handleInput(3);
  else if (holdblue) handleInput(4);

  holdkeep = true;
  count = 0;
}

/* ========= 入力 ========= */
function handleInput(n) {
  cursor.display(mouseX, mouseY, n);
  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 4; b++) {
      if (holdkeep && m[a][b].judge(mouseX, mouseY)) {
        if (heya.grid[a][b] < 10) {
          heya.grid[a][b] = n;
          holdkeep = false;
        }
      }
    }
  }
}

function mousePressed() {
  userStartAudio();
  if (!started) {
    started = true;
    return;
  }
  hold = true;
}

function mouseReleased() {
  hold = false;
  holdred = holdyellow = holdgreen = holdblue = false;
}

function mouseDragged() {
  count++;
  if (count >= 1) holdkeep = false;
}

function keyPressed() {
  if (key === ' ') {
    userStartAudio();
    started = true;
    return false;
  }
}

/* ========= クラス ========= */

class Button {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  judge(mx, my) {
    return mx > this.x && mx < this.x + this.w &&
           my > this.y && my < this.y + this.h;
  }
}

class Cursor {
  display(x, y, i) {
    noStroke();
    if (i === 1) fill(255, 0, 0);
    if (i === 2) fill(255, 255, 0);
    if (i === 3) fill(0, 255, 0);
    if (i === 4) fill(0, 0, 255);
    ellipse(x, y, 75, 75);
  }
}

class Heya {
  constructor() {
    this.grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.answerGrid = [];
    this.correctCount = 0;
    this.checked = false;
  }

  setQuestion() {
    this.grid[0][0] = 10;
    this.grid[3][0] = 30;
    this.grid[0][2] = 30;
    this.grid[2][2] = 20;
    this.grid[3][3] = 10;
  }

  setAnswer() {
    this.answerGrid = [
      [1, 4, 3, 2],
      [2, 3, 1, 4],
      [4, 1, 2, 3],
      [3, 2, 4, 1]
    ];
  }

  drawFixedCells() {
    for (let a = 0; a < 4; a++) {
      for (let b = 0; b < 4; b++) {
        if (this.grid[a][b] >= 10) {
          fill(50);
          rect((a + 2) * 100, (b + 2) * 100, 100, 100);
        }
      }
    }
  }

  drawInputs(p, r) {
    for (let a = 0; a < 4; a++) {
      for (let b = 0; b < 4; b++) {
        let v = this.grid[a][b];
        if (v > 0 && v < 10) {
          fill(175);
          rect((a + 2) * 100, (b + 2) * 100, 100, 100);
        }
      }
    }
  }

  playCellSound(a, b) {
    let v = this.grid[a][b];
    if (v >= 10) v /= 10;
    if (v === 1) doSound.play();
    if (v === 2) reSound.play();
    if (v === 3) miSound.play();
    if (v === 4) faSound.play();
  }

  checkAnswer(p, r) {
    if (p && r) {
      this.correctCount = 0;
      for (let a = 0; a < 4; a++) {
        for (let b = 0; b < 4; b++) {
          let v = this.grid[a][b];
          if (v >= 10) v /= 10;
          if (v === this.answerGrid[a][b]) this.correctCount++;
        }
      }
      this.checked = true;
    }
  }
}

class Masume {
  display() {
    strokeWeight(5);
    rect(200, 200, 400, 400);
    line(400, 200, 400, 600);
    line(200, 400, 600, 400);
  }
}
