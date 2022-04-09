const matrixStreams = [];
const matrixFadeInterval = 1.6;

class MatrixSymbol {
  constructor(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value;

    this.speed = speed;
    this.first = first;
    this.opacity = opacity;

    this.switchInterval = round(random(2, 25));
  }

  setToRandomSymbol = function () {
    const charType = round(random(0, 10));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        // set it to Katakana
        this.value = String.fromCharCode(0x30a0 + floor(random(0, 10)));
      } else {
        // set it to numeric
        this.value = floor(random(0, 10));
      }
    }
  };

  rain = function () {
    this.y = this.y >= height ? 0 : (this.y += this.speed);
  };
}

class MatrixStream {
  constructor() {
    this.symbols = [];
    // this.totalSymbols = round(random(5, 35));
    const max = window.height / SYMBOL_SIZE;
    this.totalSymbols = round(random(max - 4, max));
    this.speed = random(5, 18);
  }

  generateSymbols = function (x, y) {
    var opacity = 255;
    var first = round(random(0, 4)) == 1;
    for (var i = 0; i < this.totalSymbols; i++) {
      const symbol = new MatrixSymbol(x, y, this.speed, first, opacity);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= 255 / this.totalSymbols / matrixFadeInterval;
      y -= SYMBOL_SIZE;
      first = false;
    }
  };

  render = function () {
    this.symbols.forEach(function (symbol) {
      if (symbol.first) {
        fill(140, 255, 170, symbol.opacity);
      } else {
        if (MATRIX) {
          const x = Math.floor(symbol.x / SYMBOL_SIZE);
          const y = Math.floor(Math.abs(symbol.y / SYMBOL_SIZE));
          fill(0, 255, 70, MatrixEffect.calculateOpacity(x, y, symbol.opacity));
        } else {
          fill(0, 255, 70, symbol.opacity * 0.5);
        }
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  };
}

class MatrixEffect {
  constructor() {
    this.video = undefined;
    matrixStreams.length = 0;
  }

  static calculateOpacity(x, y, opacity) {
    const index = (x + y * video.width) * 4;
    const avg =
      (video.pixels[index + 0] +
        video.pixels[index + 1] +
        video.pixels[index + 2]) /
      3;

    if (INVERT) {
      return avg < 255 - CONTRAST ? avg : opacity / 4;
    } else {
      return avg < 255 - CONTRAST ? 255 - avg : opacity / 4;
    }
  }

  init() {
    this.video.size(
      Math.ceil(window.innerWidth / SYMBOL_SIZE),
      Math.ceil(window.innerHeight / SYMBOL_SIZE)
    );

    matrixStreams.length = 0;
    let x = 0;
    for (let i = 0; i <= width / SYMBOL_SIZE; i++) {
      var stream = new MatrixStream();
      // stream.generateSymbols(x, random(-1000, 0));
      stream.generateSymbols(x, random(window.innerHeight, 0));
      matrixStreams.push(stream);
      x += SYMBOL_SIZE;
    }

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
    background(0, 150);
    this.video.loadPixels();
    matrixStreams.forEach(function (stream) {
      stream.render();
    });
  }
}
