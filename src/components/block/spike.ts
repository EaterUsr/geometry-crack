import { Block } from "./index";
import { config } from "@config";

const spikeConf = config.components.spike;

export class Spike extends Block {
  get hitbox(): Hitbox {
    return spikeConf.getHitbox(this);
  }
  readonly color = spikeConf.color;
  readonly type = "spike";

  protected drawPatern() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.size);
    this.ctx.lineTo(this.size / 2, 0);
    this.ctx.lineTo(this.size, this.size);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
