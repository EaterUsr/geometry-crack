import { Block } from "@components/block";
import { random } from "@utils/math";
import { Spike } from "@components/block/spike";
import { Slab } from "@components/block/slab";
import { BlocksController } from "@controllers/blocks";
import { config } from "@config";

const structuresPatern = config.structures;
let lastStructure: null | Structure = null;

export function setStructure(canvas: CanvasConfig, decorations: DecorationsConfig, blocks: BlocksController) {
  const filtred = structuresPatern.filter(
    structure => structure[0].min < canvas.score && structure[0].max > canvas.score
  );
  if (filtred.length === 0) return;
  let structure: Structure;
  while (true) {
    structure = filtred[Math.floor(random(0, filtred.length - 1) + 0.5)];
    if (filtred.length === 1) break;
    if (!lastStructure) break;
    if (structure !== lastStructure) {
      break;
    }
  }
  lastStructure = structure;
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
