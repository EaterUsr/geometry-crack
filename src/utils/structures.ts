import { Block } from "@/components/blocks/block";
import { random } from "@/utils/math";
import { Spike } from "@/components/blocks/spike";
import { Slab } from "@/components/blocks/slab";
import { BlocksController } from "@/components/blocks";
import { config } from "@/config";
import { CanvasConfig, DecorationsConfig } from "@/types/config";
import { Rock } from "@/components/blocks/rock";
import { Flag } from "@/components/blocks/flag";
import { trunc } from "./decorators";

const cubeConf = config.components.cube;

export class Structures {
  private readonly structuresPatern = config.structures;
  private lastStructure: null | Structure = null;

  @trunc(1, cubeConf.jumps)
  maxJumpsLeft = cubeConf.jumps;
  private lastStructureGeneration = Date.now();

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly blocks: BlocksController
  ) {}

  build() {
    let filtred = this.structuresPatern.filter(
      structure =>
        structure[0].min < this.canvas.score &&
        structure[0].max > this.canvas.score &&
        structure[2] <= this.maxJumpsLeft &&
        structure !== this.lastStructure
    );

    if (filtred.length === 0) filtred = this.structuresPatern.filter(structure => structure[2] <= this.maxJumpsLeft);

    this.maxJumpsLeft += (Date.now() - this.lastStructureGeneration) / cubeConf.timeToRegen;

    let structure = filtred[Math.floor(random(0, filtred.length - 1) + 0.5)];

    if (!structure) return;

    this.lastStructureGeneration = Date.now();
    this.lastStructure = structure;
    this.maxJumpsLeft -= structure[2];

    const levelBlocks = structure[1].map(patern => useBlockPatern(patern, this.canvas, this.decorations));
    this.blocks.add(...levelBlocks);
  }

  reset() {
    this.maxJumpsLeft = cubeConf.jumps;
    this.lastStructure = null;
    this.lastStructureGeneration = Date.now();
  }
}

export function useBlockPatern(patern: BlockPatern, canvas: CanvasConfig, decorations: DecorationsConfig) {
  const origin: Coords = [canvas.width, decorations.floorHeight - decorations.blockSize];
  let block: Block;
  const props = [
    canvas,
    parseCoords(patern[1], decorations.blockSize, origin),
    decorations.speed,
    decorations.blockSize,
  ] as const;

  switch (patern[0]) {
    case "spike":
      block = new Spike(...props);
      break;
    case "slab":
      block = new Slab(...props);
      break;
    case "rock":
      block = new Rock(...props);
      break;
    case "flag":
      block = new Flag(...props);
      break;
  }

  return block;
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
  const levelBlocks: Block[] = [];

  level.forEach((structure, x) => {
    structure.forEach((blockType, y) => {
      if (blockType === null) return;

      levelBlocks.push(useBlockPatern([blockType, [x, y]], canvas, decorations));
    });
  });

  blocks.add(...levelBlocks);
}
