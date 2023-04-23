import { Block } from "@components/blocks";
import { Spike } from "@components/blocks/spike";
import { Slab } from "@components/blocks/slab";
import { List } from "@utils/list";
import { isCollision } from "@utils/collision";

export class BlocksController {
  private readonly content = new List<Block>();

  constructor(
    private readonly cubeSize: number,
    private readonly canvas: canvasConfig,
    private readonly graphics: graphicsConfig,
    private readonly onCubeSlabCollision: (position: coords) => void
  ) {}

  add(type: blockType, height?: number) {
    const args: [canvasConfig, coords, number, number] = [
      this.canvas,
      [
        this.canvas.width,
        height ? this.graphics.cubeOrigin[1] - height * this.graphics.blockSize : this.graphics.cubeOrigin[1],
      ],
      this.graphics.speed,
      this.graphics.blockSize,
    ];
    let block: Block;
    switch (type) {
      case "Spike":
        block = new Spike(...args);
        break;
      case "Slab":
        block = new Slab(...args, this.onCubeSlabCollision);
        break;
    }
    this.content.append(block);
  }

  update(cubeOrigin: coords, speedFrame: number, cubeHitbox: hitbox) {
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
