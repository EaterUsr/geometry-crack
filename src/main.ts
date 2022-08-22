import "./style.css";
import Cube from "./Cube";
import Cloud from "./Cloud";
import Dirt from "./Dirt";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;

const ctx = canvas.getContext("2d")!;

const { width, height } = canvas;

const speed = 0.5;
const cubeSize = 30;
const cube = new Cube(ctx, width, height, cubeSize);

const clouds: Cloud[] = [];
const dirts: Dirt[] = [];

setInterval(() => {
  clouds.push(new Cloud(ctx, Math.random(), speed / 2, Math.random(), width));
  if (clouds.length > 4) {
    clouds.splice(0, 1);
  }
}, 1000);

setInterval(() => {
  dirts.push(new Dirt(ctx, Math.random(), speed, Math.random(), width));
  if (dirts.length > 4) {
    dirts.splice(0, 1);
  }
}, 500);

function anim() {
  window.requestAnimationFrame(anim);

  ctx.fillStyle = "#00C2FF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#9B5400";
  ctx.fillRect(0, height / 2 + cubeSize / 2, width, height / 2 - 10);

  ctx.fillStyle = "#1CA600";
  ctx.fillRect(0, height / 2 + cubeSize / 2, width, 15);

  cube.update();
  clouds.forEach(cloud => {
    cloud.update();
  });
  dirts.forEach(dirt => {
    dirt.update();
  });
}
anim();
document.addEventListener("keyup", e => {
  if (e.key === " ") {
    cube.jump();
  }
});
