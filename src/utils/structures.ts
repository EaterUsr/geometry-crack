import { Block } from "@components/block";
import { random } from "@utils/math";
import { Spike } from "@components/block/spike";
import { Slab } from "@components/block/slab";
import { BlocksController } from "@controllers/blocks";
import { config } from "@config";

const structuresPatern = config.structures;

export function setStructure(
  canvas: CanvasConfig,
  decorations: DecorationsConfig,
  blocks: BlocksController,
  cubeOnSlabCollision: (position: Coords) => void
) {
  structuresPatern[Math.floor(random(0, structuresPatern.length - 1) + 0.5)].forEach((patern: StructurePatren) => {
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
          decorations.blockSize,
          cubeOnSlabCollision
        );
        break;
    }

    blocks.add(block);
  });
}

export function parseCoords(coords: Coords, blockSize: number, origin: Coords) {
  return coords.map((coords, index) => coords * blockSize + origin[index]) as Coords;
}
