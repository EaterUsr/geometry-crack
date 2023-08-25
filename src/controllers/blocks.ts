import { Block } from "@components/block";
import { List } from "@utils/list";
import { isCollision } from "@utils/collision";
import { setStructure } from "@utils/structures";

export class BlocksController {
  private readonly content = new List<Block>();

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly cubeOnSlabCollision: (position: Coords) => void,
    private readonly onCollision: (type: BlockType) => void
  ) {}

  add(block: Block) {
    this.content.append(block);
  }
  clear() {
    this.content.clear();
  }

  update(cubeOrigin: Coords, speedFrame: number, cubeHitbox: Hitbox) {
    if ((this.content.getLast()?.value.position[0] ?? 0) < 100) {
      setStructure(this.canvas, this.decorations, this, this.cubeOnSlabCollision);
    }
    this.content.forEach(block => {
      block.update(speedFrame);

      if (
        block.position[0] >= cubeOrigin[0] - this.decorations.blockSize &&
        block.position[0] < cubeOrigin[0] + this.decorations.blockSize
      ) {
        if (isCollision(block.hitbox, cubeHitbox)) this.onCollision(block.type);
      }

      if (block.position[0] + block.size < 0) {
        setTimeout(() => {
          this.content.removeFirst();
        }, 0);
      }
    });
  }
}
