import { Block } from "./block";
import { List } from "@/utils/list";
import { isCollision } from "@/utils/collision";
import { Structures, useStructure } from "@/utils/structures";
import { levels } from "@/config/levels";

export class BlocksController {
  private readonly content = new List<Block>();
  private structures: Structures | null = null;
  private updateChallenge = () => {};

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly onCollision: (block: Block) => void,
    levelName: LevelName | "challenge"
  ) {
    if (levelName === "challenge") {
      this.structures = new Structures(canvas, decorations, this);
      this.updateChallenge = () => {
        if ((this.content.getLast()?.value.position[0] ?? 0) < 100) {
          this.structures?.build();
        }
      };
    } else {
      (levels[levelName].content as StructurePatern[]).forEach(patern =>
        useStructure(patern, canvas, decorations, this)
      );
      this.updateChallenge = () => {};
    }
  }

  add(block: Block) {
    this.content.append(block);
  }

  reset(levelName: LevelName | "challenge") {
    this.content.clear();
    this.structures?.reset();
    if (levelName === "challenge") {
      this.structures = new Structures(this.canvas, this.decorations, this);
      this.updateChallenge = () => {
        if ((this.content.getLast()?.value.position[0] ?? 0) < 100) {
          this.structures?.build();
        }
      };
    } else {
      (levels[levelName].content as StructurePatern[]).forEach(patern =>
        useStructure(patern, this.canvas, this.decorations, this)
      );
      this.updateChallenge = () => {};
      this.structures = null;
    }
  }

  update(cubeOrigin: Coords, speedFrame: number, cubeHitbox: Hitbox) {
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
