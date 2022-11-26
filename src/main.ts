import "./style.css";
import Cube from "@components/Cube";
import Cloud from "@components/Cloud";
import Dirt from "@components/Dirt";
import Spike from "@components/Spike";
import Slab from "@components/Slab";
import Block from "@components/Block";
import List from "@utils/list";
import makeListController from "@utils/listController";
import { isCollision, getCoordSquare, getCoordTriangle, getCoordSlab } from "@utils/collision";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;

const ctx = canvas.getContext("2d")!;

const { width, height } = canvas;

function getRandomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const speed = width / 365 / 4;
const cubeSize = Math.floor(height / 10);
const blockSize = cubeSize;
const blockTime = Math.floor(cubeSize / speed);

const cubeOriginX = Math.floor(width / 2 - cubeSize / 2);
const cubeOriginY = Math.floor(height / 2 - cubeSize / 2);
const floorHeight = Math.floor(cubeOriginY + cubeSize);
const grassHeight = Math.floor(height / 20);

const cube = new Cube(ctx, cubeOriginX, cubeOriginY, cubeSize, floorHeight, speed);

const cloudFrequency = 0.3;
const cloudSpeed = speed / 4;

function getSizeCloud(): number {
  return getRandomBetween(width / 6, width / 5);
}
function getHeightCloud(): number {
  return Math.random() * Math.floor(width / 18);
}

function cloudInstance(): Cloud {
  return new Cloud(ctx, getSizeCloud(), cloudSpeed, getHeightCloud(), width, Boolean(Math.floor(Math.random() * 2)));
}

const updateClouds = makeListController<Cloud>(cloudFrequency, cloudSpeed, width, cloudInstance);

const dirtFrequency = 0.25;
const dirtSpeed = speed;

function getSizeDirt(): number {
  return getRandomBetween(width / 9, width / 7);
}

function getHeightDirt(): number {
  return Math.random() * Math.floor(width / 18) + Math.floor(height / 1.5);
}

function dirtInstance(): Dirt {
  return new Dirt(ctx, getSizeDirt(), dirtSpeed, getHeightDirt(), width);
}
const updateDirts = makeListController<Dirt>(dirtFrequency, dirtSpeed, width, dirtInstance);

const blocks: List<Block> = new List<Block>();

let startTime = Date.now();

let cubeCanForward = true;
let isCubeFalling = false;

function anim(): void {
  window.requestAnimationFrame(anim);

  if (isCubeFalling) cube.floorHeight = floorHeight;

  ctx.fillStyle = "#00C2FF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#9B5400";
  ctx.fillRect(0, floorHeight, width, height / 2 - cube.size / 2);

  const speedFrame = Date.now() - startTime;

  const squareCoords = getCoordSquare(
    cube.originX + cube.size * ((cube.deg % 90) / 90),
    cube.originY - cube.jumpHeight,
    -(cube.deg % 90),
    cube.size
  );
  blocks.forEach(block => {
    block.update(speedFrame);
    if (block.positionX >= cube.originX && block.positionX < cube.originX + cube.size / 2) {
      if (block instanceof Spike) {
        const triangleCoords = getCoordTriangle(block.positionX, block.positionY, block.size);
        if (isCollision(squareCoords, triangleCoords)) console.log("game over");
      } else if (block instanceof Slab) {
        const slabCoords = getCoordSlab(block.positionX, block.positionY, block.size);

        const centerSquare = squareCoords
          .reduce((coord, acc) => [coord[0] + acc[0], coord[1] + acc[1]])
          .map(coord => coord / squareCoords.length);

        if (isCollision(squareCoords, slabCoords)) {
          if (centerSquare[1] <= block.positionY && centerSquare[0] >= block.positionX / 2) {
            setTimeout(() => {
              isCubeFalling = true;
            }, blockTime);
            cube.floorHeight = block.positionY;
            cubeCanForward = true;
            isCubeFalling = false;
          } else {
            cubeCanForward = false;
          }
        }
      }
    }
    if (block.positionX < 0) {
      async () => {
        blocks.removeFirst();
      };
    }
  });

  updateClouds(speedFrame);
  updateDirts(speedFrame);
  cube.update(speedFrame, cubeCanForward);

  ctx.fillStyle = "#1CA600";
  ctx.fillRect(0, floorHeight, width, grassHeight);

  startTime = Date.now();
}
anim();

function jump(): void {
  cube.jump();
}
document.addEventListener("keydown", e => {
  if (e.key === " " || e.key === "ArrowUp") {
    jump();
  }
});
document.addEventListener("click", jump);
