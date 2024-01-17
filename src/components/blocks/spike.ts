import { triangleHitbox } from "@/utils/collision";
import { Block } from "./block";
import { config } from "@/config";

const spikeConf = config.components.spike;

export class Spike extends Block {
  get hitbox(): Hitbox {
    return triangleHitbox(...this.position, this.size);
  }
  protected readonly image: HTMLImageElement = spikeConf.img;
  readonly type = "spike";

  protected drawPatern() {
    this.ctx.drawImage(this.image, 0, 0, this.size, this.size);
  }
}
