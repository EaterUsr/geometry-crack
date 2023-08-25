import { Block } from "./index";
import { config } from "@config";
import { loadImage } from "@utils/image";

const spikeConf = config.components.spike;

export class Spike extends Block {
  get hitbox(): Hitbox {
    return spikeConf.getHitbox(this);
  }
  protected readonly image = loadImage(spikeConf.url);
  readonly type = "spike";

  protected drawPatern() {
    this.ctx.drawImage(this.image, 0, 0, this.size, this.size);
  }
}
