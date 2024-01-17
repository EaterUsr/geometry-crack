import { Block } from "./block";
import { List } from "@/utils/list";
import { isCollision } from "@/utils/collision";
import { Structures } from "@/utils/structures";

export class BlocksController {
  private readonly content = new List<Block>();
  private readonly stuctures: Structures;

  constructor(
    canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly onCollision: (block: Block) => void
  ) {
    this.stuctures = new Structures(canvas, decorations, this);
  }

  add(block: Block) {
    this.content.append(block);
  }

  reset() {
    this.content.clear();
    this.stuctures.reset();
  }

  update(cubeOrigin: Coords, speedFrame: number, cubeHitbox: Hitbox) {
    if ((this.content.getLast()?.value.position[0] ?? 0) < 100) {
      this.stuctures.build();
    }
    this.content.forEach(block => {
      block.update(speedFrame);

      if (
        block.position[0] >= cubeOrigin[0] - this.decorations.blockSize &&
        block.position[0] < cubeOrigin[0] + this.decorations.blockSize
      ) {
        if (isCollision(block.hitbox, cubeHitbox)) {
          this.onCollision(block);
        }
      }

      if (block.position[0] + block.size < 0) {
        setTimeout(() => {
          this.content.removeFirst();
        }, 0);
      }
    });
  }
}
