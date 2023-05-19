import { forward } from "@utils/move";
import { trunc } from "@utils/decorators";

export abstract class BackgroundDecoration {
  @trunc(0)
  abstract readonly y: number;
  abstract readonly color: Color;
  @trunc(0)
  abstract readonly sizeX: number;
  @trunc(0)
  abstract readonly sizeY: number;
  readonly path = new Path2D();
  position = 0;

  constructor(protected readonly canvas: CanvasConfig, private readonly speed: number) {
    this.setPath();
  }

  protected abstract setPath(): void;
  protected abstract draw(): void;

  update(speedFrame: number) {
    const distance = this.canvas.width - this.position;

    this.canvas.ctx.save();
    this.canvas.ctx.fillStyle = this.color;
    this.canvas.ctx.translate(distance, this.y);
    this.canvas.ctx.scale(this.sizeX, this.sizeY);

    this.draw();

    this.canvas.ctx.restore();

    this.forward(speedFrame);
  }

  private forward(speedFrame: number) {
    this.position = forward(this.position, this.speed, speedFrame);
  }
}
