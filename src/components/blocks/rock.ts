import { collisionRectHitbox } from "@/utils/collision";
import { Block } from "./block";
import { config } from "@/config";

const rockConf = config.components.rock;

export class Rock extends Block {
  get hitbox() {
    return collisionRectHitbox(...this.position, this.size, this.size);
  }
  readonly type = "rock";
  protected readonly image = rockConf.img;

  protected drawPatern(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, 0, this.size, this.size);
  }
}
