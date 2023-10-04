import { calcCarousel } from "@utils/carousel";
import { trunc } from "@utils/decorators";
import { config } from "@config";
import { forward } from "@utils/move";

const cloudsConf = config.decorations.clouds;

export class CloudsController {
  @trunc(0)
  readonly speed: number;
  private position = 0;
  private readonly image: HTMLImageElement = cloudsConf.img;
  @trunc(0)
  readonly scale: number;

  constructor(private readonly canvas: CanvasConfig, { speed }: DecorationsConfig) {
    this.speed = speed / cloudsConf.depth;
    this.scale = this.canvas.w(cloudsConf.scale);
  }

  private draw(position: number, img: HTMLImageElement) {
    this.canvas.ctx.save();
    this.canvas.ctx.translate(position, 0);
    this.canvas.ctx.scale(this.scale, this.scale);
    this.canvas.ctx.drawImage(img, 0, 0);
    this.canvas.ctx.restore();
  }

  update(speedFrame: number) {
    this.position = forward(this.position, speedFrame, this.speed);
    if (this.image.width !== 0) this.position %= Math.floor(this.image.width * this.scale);

    calcCarousel(this.image.width * this.scale, this.canvas.width).forEach(position => {
      this.draw(position - this.position, this.image);
    });
  }
  reset() {
    this.position = 0;
  }
}
