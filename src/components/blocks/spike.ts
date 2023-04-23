import { Block } from "./index";
import { triangleHitbox } from "@utils/collision";

export class Spike extends Block {
  get hitbox(): hitbox {
    return triangleHitbox(...this.position, this.size);
  }
  readonly color: color = "#f00";

  onCollision() {
    console.log("game over");
  }

  protected drawPatern() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.size);
    this.ctx.lineTo(this.size / 2, 0);
    this.ctx.lineTo(this.size, this.size);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
