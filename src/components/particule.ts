import { trunc } from "@utils/decorators";

export class Particule {
  @trunc(0)
  deg = 0;

  private opacity = 1;
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

    console.log(this.opacity);
    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(this.img, 0, 0);

    this.ctx.restore();

    this.position[0] += (this.vx * speedFrame) / 40;
    this.position[1] += (this.vy * speedFrame) / 40;
    this.deg += (this.vdeg * speedFrame) / 500;
    this.opacity -= speedFrame / 2000;
    console.log(this.opacity);

    if (this.opacity < 0) this.onDispawn();
  }
}
