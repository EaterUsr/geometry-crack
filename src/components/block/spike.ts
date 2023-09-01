import { Block } from "./index";
import { config } from "@config";

const spikeConf = config.components.spike;

export class Spike extends Block {
  get hitbox(): Hitbox {
    return spikeConf.getHitbox(this);
  }
  protected readonly image: HTMLImageElement = spikeConf.img;
  readonly type = "spike";

  protected drawPatern() {
    this.ctx.drawImage(this.image, 0, 0, this.size, this.size);
  }
}
