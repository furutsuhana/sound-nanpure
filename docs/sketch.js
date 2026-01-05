// p5.js version of Sound Nanpure (mp3 edition)

let masume, heya;
let hold = false;
let holdkeep = true;
let holdred = false;
let holdyellow = false;
let holdgreen = false;
let holdblue = false;
let count = 0;
let kpress = false;

let b1, b2, b3, b4;
let easyBtn, answerBtn;
let m = [];
let cursor;

let img;
let doSound, reSound, miSound, faSound;
let seikaiSound, fuseikaiSound;

function preload() {
  img = loadImage("opening.jpeg");
  doSound = loadSound("sounds/do.mp3");
  reSound = loadSound("sounds/re.mp3");
  miSound = loadSound("sounds/mi.mp3");
  faSound = loadSound("sounds/fa.mp3");
  seikaiSound = loadSound("sounds/seikai.mp3");
  fuseikaiSound = loadSound("sounds/fuseikai.mp3");
}

function setup() {
  createCanvas(800, 800);

  masume = new Masume();
  heya = new Heya();
  heya.answer();
  heya.kotae();

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

function draw() {
  // ===== オープニング画面 =====
  if (!kpress) {
    image(img, 0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Click or Press SPACE to start", width / 2, height - 60);

    return;
  }

  // ===== ゲーム画面 =====
  background(255);
  masume.display();
  heya.answerdisplay();

  heya.display(easyBtn.judge(mouseX, mouseY), hold);
  heya.kotaeawase(answerBtn.judge(mouseX, mouseY), hold);

  if (heya.check === 1) {
    if (heya.sum >= 16) {
      strokeWeight(50);
      stroke(255, 0, 0);
      noFill();
      circle(width / 2, height / 2, 500);
      seikaiSound.play();
      noLoop();
    } else {
      strokeWeight(50);
      stroke(0, 0, 255);
      line(175, 175, 625, 625);
      line(175, 625, 625, 175);
      fuseikaiSound.play();
      noLoop();
    }
  }

  if (hold) {
    if (b1.judge(mouseX, mouseY)) {
      doSound.play();
      holdred = true;
    } else if (b2.judge(mouseX, mouseY)) {
      reSound.play();
      holdyellow = true;
    } else if (b3.judge(mouseX, mouseY)) {
      miSound.play();
      holdgreen = true;
    } else if (b4.judge(mouseX, mouseY)) {
      faSound.play();
      holdblue = true;
    }

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

function handleInput(n) {
  cursor.display(mouseX, mouseY, n);
  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 4; b++) {
      if (holdkeep && m[a][b].judge(mouseX, mouseY)) {
        if (heya.masu[a][b] < 10) {
          heya.masu[a][b] = n;
          holdkeep = false;
        }
      }
    }
  }
}

// ===== 入力系 =====

function mousePressed() {
  if (!kpress) {
    kpress = true;   // クリックでスタート
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
    kpress = true;   // スペースでスタート
    return false;    // スクロール防止
  }
}

// ===== クラス =====

class Button {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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
    this.masu = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.kotae = [];
    this.sum = 0;
    this.check = 0;
    this.q = 0;
  }

  answer() {
    this.masu[0][0] = 10;
    this.masu[3][0] = 30;
    this.masu[0][2] = 30;
    this.masu[2][2] = 20;
    this.masu[3][3] = 10;
  }

  kotae() {
    this.kotae = [
      [1, 4, 3, 2],
      [2, 3, 1, 4],
      [4, 1, 2, 3],
      [3, 2, 4, 1]
    ];
  }

  answerdisplay() {
    for (let a = 0; a < 4; a++) {
      for (let b = 0; b < 4; b++) {
        if (this.masu[a][b] >= 10) {
          fill(50);
          rect((a + 2) * 100, (b + 2) * 100, 100, 100);
        }
      }
    }
  }

  display(p, r) {
    if (p && r) this.q++;
    for (let a = 0; a < 4; a++) {
      for (let b = 0; b < 4; b++) {
        let v = this.masu[a][b];
        if (v > 0 && v < 10) {
          if (this.q % 2 === 0) fill(175);
          else if (v === 1) fill(225, 0, 0, 175);
          else if (v === 2) fill(255, 255, 0, 175);
          else if (v === 3) fill(0, 255, 0, 175);
          else if (v === 4) fill(0, 0, 255, 175);
          rect((a + 2) * 100, (b + 2) * 100, 100, 100);
        }
      }
    }
  }

  playCellSound(a, b) {
    let v = this.masu[a][b];
    if (v >= 10) v /= 10;
    if (v === 1) doSound.play();
    if (v === 2) reSound.play();
    if (v === 3) miSound.play();
    if (v === 4) faSound.play();
  }

  kotaeawase(p, r) {
    if (p && r) {
      this.sum = 0;
      for (let a = 0; a < 4; a++) {
        for (let b = 0; b < 4; b++) {
          let v = this.masu[a][b];
          if (v >= 10) v /= 10;
          this.sum += (v === this.kotae[a][b]) ? 1 : 0;
        }
      }
      this.check = 1;
    }
  }
}

class Masume {
  display() {
    strokeWeight(5);
    line(200, 400, 600, 400);
    line(400, 200, 400, 600);
    rect(200, 200, 400, 400);

    fill(255, 0, 0); ellipse(100, 100, 100);
    fill(255, 255, 0); ellipse(300, 100, 100);
    fill(0, 255, 0); ellipse(500, 100, 100);
    fill(0, 0, 255); ellipse(700, 100, 100);

    fill(75);
    rect(50, 650, 300, 100);
    rect(450, 650, 300, 100);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(75);
    text("easy", 200, 700);
    text("answer", 600, 700);

    strokeWeight(1);
    line(300, 200, 300, 600);
    line(500, 200, 500, 600);
    line(200, 300, 600, 300);
    line(200, 500, 600, 500);
  }
}

