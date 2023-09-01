import { Block } from ".";
import { config } from "@config";

const slabConf = config.components.slab;

export class Slab extends Block {
  get hitbox() {
    return slabConf.getHitbox(this);
  }
  readonly type = "slab";
  protected readonly image = slabConf.img;

  protected drawPatern() {
    this.ctx.drawImage(this.image, 0, 0, this.size, this.size / 2);
  }
}
