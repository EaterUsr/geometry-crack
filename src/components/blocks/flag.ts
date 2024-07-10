import { rectHitbox } from "@/utils/collision";
import { Block } from "./block";
import { config } from "@/config";

const flagConf = config.components.flag;

export class Flag extends Block {
  get hitbox() {
    return rectHitbox(this.position[0] + this.size, 0, this.size, this.canvas.height);
  }
  readonly type = "flag";
  protected readonly image = flagConf.img;

  protected drawPatern(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, 0, this.size, this.size);
  }
}
