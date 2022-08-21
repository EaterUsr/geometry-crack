import "./style.css";
import Cube from "./Cube";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;

const ctx = canvas.getContext("2d")!;

const { width, height } = canvas;

const cubeSize = 30;
const cube = new Cube(ctx, width, height, cubeSize);

function anim() {
  window.requestAnimationFrame(anim);

  ctx.fillStyle = "#00C2FF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#9B5400";
  ctx.fillRect(0, height / 2 + cubeSize / 2, width, height / 2 - 10);

  ctx.fillStyle = "#1CA600";
  ctx.fillRect(0, height / 2 + cubeSize / 2, width, 15);
  ctx.save();

  cube.update();
  ctx.restore();
}
anim();
document.addEventListener("keyup", e => {
  if (e.key === " ") {
    cube.jump();
  }
});
