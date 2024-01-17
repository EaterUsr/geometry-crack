import { trunc } from "@/utils/decorators";
import { truncNbr } from "@/utils/math";

export class Particule {
  @trunc(0)
  deg = 0;

  @trunc(1)
  opacity = 1;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(
    private readonly position: Coords,
    private readonly img: HTMLImageElement,
    private readonly vx: number,
    private readonly vy: number,
    private readonly vdeg: number,
    private readonly onDispawn: () => void,
    { ctx }: CanvasConfig
  ) {
    this.ctx = ctx;
  }

  update(speedFrame: number) {
    this.ctx.save();

    this.ctx.translate(...this.position);
    this.ctx.rotate(this.deg);

    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(this.img, 0, 0);

    this.ctx.restore();

    this.position[0] += truncNbr((this.vx * speedFrame) / 40, 0);
    this.position[1] += truncNbr((this.vy * speedFrame) / 40, 0);
    this.deg += truncNbr((this.vdeg * speedFrame) / 500);
    this.opacity -= speedFrame / 2000;
    this.opacity = Math.abs(this.opacity);

    if (this.opacity < 0) this.onDispawn();
  }
}
