let heya;
let sounds = [];
let started = false;

function preload() {
  sounds[1] = loadSound("sounds/do.mp3");
  sounds[2] = loadSound("sounds/re.mp3");
  sounds[3] = loadSound("sounds/mi.mp3");
  sounds[4] = loadSound("sounds/fa.mp3");
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  textSize(32);

  heya = new Heya();
  heya.setKotae();
}

function draw() {
  background(240);

  if (!started) {
    fill(0);
    text(
      "Sound Nanpure\nPress SPACE",
      width / 2,
      height / 2
    );
    return;
  }

  heya.draw();
}

function keyPressed() {
  if (key === ' ') {
    userStartAudio();   // ★ 音を鳴らすため必須
    started = true;
  }
}

function mousePressed() {
  if (!started) return;
  userStartAudio();
  heya.playSoundAt(mouseX, mouseY);
}

/* =====================
   ナンプレ部屋クラス
===================== */
class Heya {
  constructor() {
    this.size = 4;
    this.cell = 100;
    this.offset = 100;
    this.kotae = [];
  }

  setKotae() {
    this.kotae = [
      [1, 4, 3, 2],
      [2, 3, 1, 4],
      [4, 1, 2, 3],
      [3, 2, 4, 1]
    ];
  }

  draw() {
    stroke(0);

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let px = x * this.cell + this.offset;
        let py = y * this.cell + this.offset;

        fill(255);
        rect(px, py, this.cell, this.cell);

        fill(0);
        textSize(32);
        text(
          this.kotae[y][x],
          px + this.cell / 2,
          py + this.cell / 2
        );
      }
    }
  }

  playSoundAt(mx, my) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let px = x * this.cell + this.offset;
        let py = y * this.cell + this.offset;

        if (
          mx > px && mx < px + this.cell &&
          my > py && my < py + this.cell
        ) {
          let n = this.kotae[y][x];
          if (sounds[n]) {
            sounds[n].play();
          }
        }
      }
    }
  }
}


