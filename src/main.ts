import "./style.css";
import Cube from "@components/Cube";
import Cloud from "@components/Cloud";
import Dirt from "@components/Dirt";
import makeListController from "@utils/listController";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;

const ctx = canvas.getContext("2d")!;

const { width, height } = canvas;

const speed = 0.5;
const cubeSize = 30;
const cube = new Cube(ctx, width, height, cubeSize);

const cloudFrequency = 0.3;
const cloudSpeed = speed / 4;

function cloudInstance() {
  return new Cloud(ctx, Math.random(), cloudSpeed, Math.random(), width, Boolean(Math.floor(Math.random() * 2)));
}

const updateClouds = makeListController<Cloud>(cloudFrequency, cloudSpeed, width, cloudInstance);

const dirtFrequency = 0.25;
const dirtSpeed = speed;

function dirtInstance() {
  return new Dirt(ctx, Math.random(), dirtSpeed, Math.random(), width);
}
const updateDirts = makeListController<Dirt>(dirtFrequency, dirtSpeed, width, dirtInstance);

let startTime = Date.now();

function anim() {
  window.requestAnimationFrame(anim);

  ctx.fillStyle = "#00C2FF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#9B5400";
  ctx.fillRect(0, height / 2 + cubeSize / 2, width, height / 2 - 10);

  ctx.fillStyle = "#1CA600";
  ctx.fillRect(0, height / 2 + cubeSize / 2, width, 15);

  const speedFrame = Date.now() - startTime;

  cube.update(speedFrame);
  updateClouds(speedFrame);
  updateDirts(speedFrame);

  startTime = Date.now();
}
anim();
document.addEventListener("keyup", e => {
  if (e.key === " ") {
    cube.jump();
  }
});
