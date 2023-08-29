import { calcCarousel } from "@utils/carousel";
import { trunc } from "@utils/decorators";
import { loadImage } from "@utils/image";
import { config } from "@config";
import { forward } from "@utils/move";

const grassConf = config.decorations.grass;

export class GrassController {
  private readonly speed: number;
  private readonly floorHeight: number;
  private position = 0;
  private readonly image = loadImage(grassConf.url);
  @trunc(0)
  readonly scale: number;

  constructor(private readonly canvas: CanvasConfig, { speed, floorHeight }: DecorationsConfig) {
    this.floorHeight = floorHeight;
    this.scale = this.canvas.w(grassConf.scale);
    this.speed = speed;
  }

  private draw(position: number, img: HTMLImageElement) {
    this.canvas.ctx.save();
    this.canvas.ctx.translate(position, this.floorHeight - this.image.height * this.scale + 1);
    this.canvas.ctx.scale(this.scale, this.scale);
    this.canvas.ctx.drawImage(img, 0, 0);
    this.canvas.ctx.restore();
  }

  update(speedFrame: number) {
    this.position = forward(this.position, this.speed, speedFrame);
    if (this.image.width !== 0) this.position %= Math.floor(this.image.width * this.scale);

    calcCarousel(this.image.width * this.scale, this.canvas.width).forEach(position => {
      this.draw(position - this.position, this.image);
    });
  }
  reset() {
    this.position = 0;
  }
}
