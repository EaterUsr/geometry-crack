import { rectHitbox } from "@/utils/collision";
import { Block } from "./block";
import { config } from "@/config";

const slabConf = config.components.slab;

export class Slab extends Block {
  get hitbox() {
    return rectHitbox(...this.position, this.size, Math.floor(this.size / 2));
  }
  readonly type = "slab";
  protected readonly image = slabConf.img;

  protected drawPatern() {
    this.ctx.drawImage(this.image, 0, 0, this.size, this.size / 2);
  }
}
