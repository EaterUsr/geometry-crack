import { Block } from "@components/block";
import { random, truncNbr } from "@utils/math";
import { Spike } from "@components/block/spike";
import { Slab } from "@components/block/slab";
import { BlocksController } from "@controllers/blocks";
import { config } from "@config";

const structuresPatern = config.structures;
let lastStructure: null | Structure = null;
let minJumps = config.components.cube.jumps;
let lastStructureGeneration = Date.now();

export function setStructure(canvas: CanvasConfig, decorations: DecorationsConfig, blocks: BlocksController) {
  console.log(canvas.score);
  let filtred = structuresPatern.filter(
    structure => structure[0].min < canvas.score && structure[0].max > canvas.score && structure[2] <= minJumps
  );
  if (filtred.length === 0) {
    filtred = structuresPatern.filter(structure => structure[2] <= minJumps && structure[0].min < canvas.score);
    if (filtred.length === 0) return;
  }

  minJumps += truncNbr((Date.now() - lastStructureGeneration) / config.components.cube.timeToRegen);

  let structure: Structure;
  while (true) {
    structure = filtred[Math.floor(random(0, filtred.length - 1) + 0.5)];
    if (filtred.length === 1) break;
    if (!lastStructure) break;
    if (structure !== lastStructure) {
      break;
    }
  }
  lastStructureGeneration = Date.now();
  lastStructure = structure;
  minJumps -= structure[2];
  structure[1].forEach((patern: StructurePatern) => {
    const origin: Coords = [canvas.width, decorations.floorHeight - decorations.blockSize];

    let block: Block;
    switch (patern[0]) {
      case "spike":
        block = new Spike(
          canvas,
          parseCoords(patern[1], decorations.blockSize, origin),
          decorations.speed,
          decorations.blockSize
        );
        break;
      case "slab":
        block = new Slab(
          canvas,
          parseCoords(patern[1], decorations.blockSize, origin),
          decorations.speed,
          decorations.blockSize
        );
        break;
    }

    blocks.add(block);
  });
}

export function parseCoords(coords: Coords, blockSize: number, origin: Coords) {
  return coords.map((coords, index) => coords * blockSize + origin[index]) as Coords;
}

export function reset() {
  minJumps = config.components.cube.jumps;
  lastStructure = null;
  lastStructureGeneration = Date.now();
}
