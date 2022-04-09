class CameraEffect {
  static density = "@#O%+=|i-:.       ";
  constructor() {
    this.video = undefined;
  }

  init() {
    this.video.size(
      Math.ceil(window.innerWidth / SYMBOL_SIZE),
      Math.ceil(window.innerHeight / SYMBOL_SIZE)
    );
    textSize(SYMBOL_SIZE);
  }

  setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);
    frameRate(FPS);
    this.video = createCapture(VIDEO);
    this.init();
    this.video.hide();
    textFont("Consolas");
  }

  draw() {
    background(0);
    this.video.loadPixels();

    for (let i = 0; i < this.video.width; i++) {
      for (let j = 0; j < this.video.height; j++) {
        const index = (i + j * this.video.width) * 4;
        const avg =
          (this.video.pixels[index] +
            this.video.pixels[index + 1] +
            this.video.pixels[index + 2]) /
          3;

        if (MATRIX) {
          CameraEffect.staticRenderCharMatrix(i, j, avg);
        } else {
          CameraEffect.staticRenderChar(i, j, avg);
        }
      }
    }
  }

  static staticRenderCharMatrix(x, y, avg) {
    const min = 32;
    const c = String.fromCharCode(0x30a0 + floor(random(0, 96)));
    const opacity = Math.floor(map(avg, 0, CONTRAST, 255, 0));

    fill(0, 255, 70, INVERT ? 255 - opacity : opacity);
    text(c, x * SYMBOL_SIZE, y * SYMBOL_SIZE);
  }

  static staticRenderChar(x, y, avg) {
    avg = avg + CONTRAST / 4 > 255 ? 255 : avg + CONTRAST / 4;
    const charIndex = Math.floor(
      map(avg, 0, 255, CameraEffect.density.length, 0)
    );
    if (INVERT) {
      fill(0, 255, 70, 255);
    } else {
      fill(255, 255, 255, 255);
    }
    text(
      CameraEffect.density.charAt(charIndex),
      x * SYMBOL_SIZE,
      y * SYMBOL_SIZE
    );
  }
}
