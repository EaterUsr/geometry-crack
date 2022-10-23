import "./style.css";
import Cube from "@components/Cube";
import Cloud from "@components/Cloud";
import Dirt from "@components/Dirt";
import makeListController from "@utils/listController";
import Spike from "@components/Spike";
import Block from "@components/Block";
import { isCollision, getCoordSquare, getCoordTriangle } from "@utils/collision";
import List from "@utils/list";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;

const ctx = canvas.getContext("2d")!;

const { width, height } = canvas;

const speed = 0.5;
const cubeSize = 30;

const cubeOriginX = width / 2 - cubeSize / 2;
const cubeOriginY = height / 2 - cubeSize / 2;
const floorHeight = cubeOriginY + cubeSize;

const cube = new Cube(ctx, cubeOriginX, cubeOriginY, cubeSize);

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

const blockSize = cube.size;

const blocks: List<Block> = new List<Block>();

setInterval(() => {
  blocks.append(new Spike(ctx, width, cubeOriginY, speed, blockSize, width));
}, 1000);

let startTime = Date.now();

function anim() {
  window.requestAnimationFrame(anim);

  ctx.fillStyle = "#00C2FF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#9B5400";
  ctx.fillRect(0, floorHeight, width, height / 2 - 10);

  ctx.fillStyle = "#1CA600";
  ctx.fillRect(0, floorHeight, width, 15);

  const speedFrame = Date.now() - startTime;

  cube.update(speedFrame);
  updateClouds(speedFrame);
  updateDirts(speedFrame);

  blocks.forEach(block => {
    block.update(speedFrame);
    if (block.positionX >= cubeOriginX && block.positionX <= cubeOriginX + cube.size / 2 && block instanceof Spike) {
      const squareCoords = getCoordSquare(cube.originX, cube.originY - cube.jumpHeight, cube.deg, cube.size);
      const triangleCoords = getCoordTriangle(block.positionX, block.positionY, block.size);

      if (isCollision(squareCoords, triangleCoords)) console.log("game over");
    }
    if (block.positionX < 0 - block.size) {
      async () => {
        blocks.removeFirst();
      };
    }
  });

  startTime = Date.now();
}
anim();
document.addEventListener("keyup", e => {
  if (e.key === " ") {
    cube.jump();
  }
});
