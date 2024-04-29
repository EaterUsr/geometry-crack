import { rectHitbox } from "@/utils/collision";
import { Block } from "./block";
import { config } from "@/config";

const rockConf = config.components.rock;

export class Rock extends Block {
  get hitbox() {
    return rectHitbox(...this.position, this.size, this.size);
  }
  readonly type = "rock";
  protected readonly image = rockConf.img;

  protected drawPatern() {
    this.ctx.drawImage(this.image, 0, 0, this.size, this.size);
  }
}
