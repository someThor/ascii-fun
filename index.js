let SYMBOL_SIZE = 12;
let CONTRAST = 200;
let FPS = 5;

let INVERT = false;
let MATRIX = false;

document.addEventListener("DOMContentLoaded", (e) => {
  console.log(`Document is ready!`);
  startSketch(new CameraEffect());
  // startSketch(new MatrixEffect());
});

let effect;

const clearSketch = function () {
  if (window.p5 && p5.instance) {
    p5.instance.remove();
    p5.instance = null;
    window.setup = null;
    window.draw = null;
  } else {
    const canv = document.querySelector("canvas");
    canv && canv.remove();
  }
};

const startSketch = function (effect) {
  window.init = effect.init;
  window.setup = effect.setup;
  window.draw = effect.draw;
  window.p5 && (window.setup || window.draw) && new p5();
};

document.onkeydown = function (e) {
  const symbolIncrement = 4;
  const cIncrement = 16;
  const fpsIncrement = 2;

  if (e.key == "0") {
    clearSketch();
  }

  if (e.key == "+") {
    SYMBOL_SIZE += symbolIncrement;
    window.init();
  }

  if (e.key == "-") {
    const newVal = SYMBOL_SIZE - symbolIncrement;
    if (newVal != SYMBOL_SIZE && newVal >= 8) {
      SYMBOL_SIZE = newVal;
      window.init();
    }
  }

  if (e.key == "ArrowLeft") {
    FPS -= fpsIncrement;
    FPS = FPS < 1 ? 1 : FPS;
    frameRate(FPS);
  }

  if (e.key == "ArrowRight") {
    FPS += fpsIncrement;
    frameRate(FPS);
  }

  if (e.key == "ArrowUp") {
    CONTRAST += cIncrement;
    CONTRAST = CONTRAST > 255 ? 255 : CONTRAST;
  }

  if (e.key == "ArrowDown") {
    CONTRAST -= cIncrement;
    CONTRAST = CONTRAST < 0 ? 0 : CONTRAST;
  }

  if (e.key == "i") {
    INVERT = !INVERT;
  }

  if (e.key == "m") {
    MATRIX = !MATRIX;
  }

  if (e.key == "1") {
    clearSketch();
    startSketch(new CameraEffect());
  }

  if (e.key == "2") {
    clearSketch();
    startSketch(new MatrixEffect());
  }
};
