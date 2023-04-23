import { Block } from ".";
import { rectHitbox } from "@utils/collision";

export class Slab extends Block {
  get hitbox() {
    return rectHitbox(...this.position, this.size, this.size / 2);
  }
  readonly color: color = "#000";

  constructor(
    canvas: canvasConfig,
    position: coords,
    speed: number,
    size: number,
    private readonly cubeOnSlabCollision: (position: coords) => void
  ) {
    super(canvas, position, speed, size);
  }

  onCollision() {
    this.cubeOnSlabCollision(this.position);
  }

  protected drawPatern() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.size, 0);
    this.ctx.lineTo(this.size, this.size / 2);
    this.ctx.lineTo(0, this.size / 2);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
