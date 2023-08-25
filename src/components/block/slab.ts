import { Block } from ".";
import { config } from "@config";

const slabConf = config.components.slab;

export class Slab extends Block {
  get hitbox() {
    return slabConf.getHitbox(this);
  }
  readonly color: Color = slabConf.color;
  readonly type = "slab";

  constructor(
    canvas: CanvasConfig,
    position: Coords,
    speed: number,
    size: number,
    private readonly cubeOnSlabCollision: (position: Coords) => void
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
