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
  heya.setKotae();   // ★ 修正ポイント（関数名）
}

function draw() {
  background(240);

  if (!started) {
    fill(0);
    text("Sound Nanpure\nPress SPACE", width / 2, height / 2);
    return;
  }

  heya.draw();
}

function keyPressed() {
  if (key === ' ') {
    userStartAudio(); // ★ 音を鳴らすため必須
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
    this.kotae = [];
  }

  // ★ 関数名を変更（重要）
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
          x * this.cell + 100,
          y * this.cell + 100,
          this.cell,
          this.cell
        );

        fill(0);
        textSize(32);
        text(
          this.kotae[y][x],
          x * this.cell + 150,
          y * this.cell + 150
        );
      }
    }
  }
}

