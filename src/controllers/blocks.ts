import { Block } from "@components/block";
import { Spike } from "@components/block/spike";
import { Slab } from "@components/block/slab";
import { List } from "@utils/list";
import { isCollision } from "@utils/collision";

export class BlocksController {
  private readonly content = new List<Block>();

  constructor(
    private readonly cubeSize: number,
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly onCubeSlabCollision: (position: Coords) => void
  ) {}

  add(type: BlockType, height?: number) {
    const args: [CanvasConfig, Coords, number, number] = [
      this.canvas,
      [
        this.canvas.width,
        height ? this.decorations.cubeOrigin[1] - height * this.decorations.blockSize : this.decorations.cubeOrigin[1],
      ],
      this.decorations.speed,
      this.decorations.blockSize,
    ];
    let block: Block;

    switch (type) {
      case "spike":
        block = new Spike(...args);
        break;
      case "slab":
        block = new Slab(...args, this.onCubeSlabCollision);
        break;
    }
    this.content.append(block);
  }

  update(cubeOrigin: Coords, speedFrame: number, cubeHitbox: Hitbox) {
    this.content.forEach(block => {
      block.update(speedFrame);

      if (block.position[0] >= cubeOrigin[0] - this.cubeSize && block.position[0] < cubeOrigin[0] + this.cubeSize) {
        if (isCollision(block.hitbox, cubeHitbox)) block.onCollision();
      }

      if (block.position[0] + block.size < 0) {
        setTimeout(() => {
          this.content.removeFirst();
        }, 0);
      }
    });
  }
}
