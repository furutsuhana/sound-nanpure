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
  const c = createCanvas(600, 600);
  c.parent(document.body); // body中央に表示
  textAlign(CENTER, CENTER);

  heya = new Heya();
  heya.setKotae();
}

function draw() {
  background(240);

  if (!started) {
    fill(0);
    textSize(32);
    text("Press SPACE", width / 2, height / 2);
    return;
  }

  heya.draw();
}

function keyPressed() {
  if (key === ' ') {
    userStartAudio();
    started = true;
  }
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
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        stroke(0);
        fill(255);
        rect(
          x * this.cell + this.offset,
          y * this.cell + this.offset,
          this.cell,
          this.cell
        );

        fill(0);
        textSize(32);
        text(
          this.kotae[y][x],
          x * this.cell + this.offset + this.cell / 2,
          y * this.cell + this.offset + this.cell / 2
        );
      }
    }
  }
}
