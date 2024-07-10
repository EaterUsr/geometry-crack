import { Block } from "./block";
import { ViewItems, Node } from "@/utils/viewItems";
import { isCollision } from "@/utils/collision";
import { Structures, useLevel } from "@/utils/structures";
import { levels } from "@/config/levels";
import { CanvasConfig, DecorationsConfig } from "@/types/config";
import { DrawOptions } from "@/utils/layers";

export class BlocksController {
  private readonly content = new ViewItems<Block>();
  private structures: Structures | null = null;
  private updateChallenge = () => {};
  flagDistance: null | number = null;
  levelSize: null | number = null;
  layerCategory: LayerCategory = "blocks";

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly onCollision: (block: Block) => void,
    private levelName: LevelName
  ) {
    this.reset();
  }

  add(...blocks: Block[]) {
    this.content.append(...blocks);
  }

  reset() {
    this.content.clear();
    this.structures?.reset();

    this.flagDistance = null;
    this.levelSize = null;
    this.structures = null;
    this.levelName = 0;
  }

  build(levelName: LevelName) {
    this.levelName = levelName;

    if (this.levelName === 0) {
      this.structures = new Structures(this.canvas, this.decorations, this);

      this.updateChallenge = () => {
        const lastBlock = this.content.getLast();

        if (lastBlock === null) {
          (this.structures as Structures).build();
          return;
        }

        if (lastBlock.value.position[0] < 100) {
          (this.structures as Structures).build();
        }
      };
    } else {
      useLevel(levels[this.levelName].content, this.canvas, this.decorations, this);
      this.levelSize = this.calcFlagDistance();
      this.flagDistance = this.levelSize;
      this.updateChallenge = () => {};
    }
  }

  private calcFlagDistance() {
    return (
      (this.content.getLast() as Node<Block>).value.position[0] -
      this.decorations.cubeOrigin[0] -
      this.decorations.blockSize
    );
  }

  update(speedFrame: number, cubeOrigin: Coords, cubeHitbox: Hitbox) {
    if (this.levelName !== 0) this.flagDistance = this.calcFlagDistance();

    this.updateChallenge();
    this.content.forEach((block: Block) => {
      block.update(speedFrame);

      if (
        block.position[0] >= cubeOrigin[0] - this.decorations.blockSize &&
        block.position[0] < cubeOrigin[0] + this.decorations.blockSize
      ) {
        if (isCollision(block.hitbox, cubeHitbox)) {
          this.onCollision(block);
        }
      }

      if (block.position[0] + block.size < 0) return true;

      return;
    });
  }

  draw({ ctx }: DrawOptions) {
    this.content.forEach(block => block.draw(ctx));
  }
}
