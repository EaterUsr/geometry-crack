import { Block } from "./block";
import { List, Node } from "@/utils/list";
import { isCollision } from "@/utils/collision";
import { Structures, useLevel } from "@/utils/structures";
import { levels } from "@/config/levels";
import { CanvasConfig, DecorationsConfig } from "@/types/config";

export class BlocksController {
  private readonly content = new List<Block>();
  private structures: Structures | null = null;
  private updateChallenge = () => {};
  flagDistance: null | number = null;
  levelSize: null | number = null;

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly onCollision: (block: Block) => void,
    levelName: LevelName
  ) {
    this.reset(levelName);
  }

  add(block: Block) {
    this.content.append(block);
  }

  reset(levelName: LevelName) {
    this.content.clear();
    this.structures?.reset();
    if (levelName === 0) {
      this.structures = new Structures(this.canvas, this.decorations, this);
      this.updateChallenge = () => {
        if ((this.content.getLast()?.value.position[0] ?? 0) < 100) {
          this.structures?.build();
        }
      };
      this.flagDistance = null;
      this.levelSize = null;
    } else {
      useLevel(levels[levelName].content, this.canvas, this.decorations, this);
      this.levelSize = this.calcFlagDistance();
      this.flagDistance = this.levelSize;
      this.updateChallenge = () => {};
      this.structures = null;
    }
  }

  private calcFlagDistance() {
    return (
      (this.content.getLast() as Node<Block>).value.position[0] -
      this.decorations.cubeOrigin[0] -
      this.decorations.blockSize
    );
  }

  update(cubeOrigin: Coords, speedFrame: number, cubeHitbox: Hitbox) {
    if (this.content.length !== 0) this.flagDistance = this.calcFlagDistance();

    this.updateChallenge();
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
