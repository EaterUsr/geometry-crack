import { Block } from ".";
import { config } from "@config";
import { loadImage } from "@utils/image";

const slabConf = config.components.slab;

export class Slab extends Block {
  get hitbox() {
    return slabConf.getHitbox(this);
  }
  readonly type = "slab";
  protected readonly image = loadImage(slabConf.url);

  protected drawPatern() {
    this.ctx.drawImage(this.image, 0, 0, this.size, this.size / 2);
  }
}