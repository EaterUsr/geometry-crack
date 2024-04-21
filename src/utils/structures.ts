import { Block } from "@/components/blocks/block";
import { random, truncNbr } from "@/utils/math";
import { Spike } from "@/components/blocks/spike";
import { Slab } from "@/components/blocks/slab";
import { BlocksController } from "@/components/blocks";
import { config } from "@/config";

export class Structures {
  private readonly structuresPatern = config.structures;
  private lastStructure: null | Structure = null;
  private minJumps = config.components.cube.jumps;
  private lastStructureGeneration = Date.now();

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly blocks: BlocksController
  ) {}

  build() {
    let filtred = this.structuresPatern
      .filter(
        structure =>
          structure[0].min < this.canvas.score && structure[0].max > this.canvas.score && structure[2] <= this.minJumps
      )
      .filter(structure => structure !== this.lastStructure)
      .filter(structure => structure[2] <= this.minJumps);

    if (filtred.length === 0) filtred = this.structuresPatern.filter(structure => structure[2] <= this.minJumps);

    this.minJumps += truncNbr((Date.now() - this.lastStructureGeneration) / config.components.cube.timeToRegen);

    let structure = filtred[Math.floor(random(0, filtred.length - 1) + 0.5)];

    this.lastStructureGeneration = Date.now();
    this.lastStructure = structure;
    this.minJumps -= structure[2];

    structure[1].forEach(patern => useStructure(patern, this.canvas, this.decorations, this.blocks));
  }

  reset() {
    this.minJumps = config.components.cube.jumps;
    this.lastStructure = null;
    this.lastStructureGeneration = Date.now();
  }
}

export function useStructure(
  patern: StructurePatern,
  canvas: CanvasConfig,
  decorations: DecorationsConfig,
  blocks: BlocksController
) {
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
}

export function parseCoords(coords: Coords, blockSize: number, origin: Coords) {
  return [coords[0] * blockSize + origin[0], -coords[1] * blockSize + origin[1]] as Coords;
}

export function useLevel(
  level: LevelData,
  canvas: CanvasConfig,
  decorations: DecorationsConfig,
  blocks: BlocksController
) {
  const origin: Coords = [canvas.width, decorations.floorHeight - decorations.blockSize];

  level.forEach((structure, x) => {
    structure.forEach((blockType, y) => {
      if (blockType === null) return;
      let block: Block;

      switch (blockType) {
        case "slab":
          block = new Slab(
            canvas,
            parseCoords([x, y], decorations.blockSize, origin),
            decorations.speed,
            decorations.blockSize
          );
          break;
        case "spike":
          block = new Spike(
            canvas,
            parseCoords([x, y], decorations.blockSize, origin),
            decorations.speed,
            decorations.blockSize
          );
          break;
      }

      blocks.add(block);
    });
  });
}
