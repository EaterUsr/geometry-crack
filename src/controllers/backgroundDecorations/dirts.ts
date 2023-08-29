import { calcCarousel } from "@utils/carousel";
import { trunc } from "@utils/decorators";
import { loadImage } from "@utils/image";
import { config } from "@config";
import { forward } from "@utils/move";

const dirtConf = config.decorations.dirts;

export class DirtsController {
  private readonly speed: number;
  private readonly floorHeight: number;
  private position = 0;
  private readonly images = dirtConf.urls.map(loadImage);
  private readonly depths = dirtConf.depths;
  private readonly margins = dirtConf.margins;
  @trunc(0)
  readonly scale: number;

  constructor(private readonly canvas: CanvasConfig, { speed, floorHeight }: DecorationsConfig) {
    this.speed = speed;
    this.floorHeight = floorHeight;
    this.scale = this.canvas.w(dirtConf.scale);
  }

  private draw(position: number, img: HTMLImageElement, depth: number) {
    this.canvas.ctx.save();
    this.canvas.ctx.translate(position, Math.floor(this.floorHeight + (this.canvas.width / 100) * depth));
    this.canvas.ctx.scale(this.scale, this.scale);
    this.canvas.ctx.drawImage(img, 0, 0);
    this.canvas.ctx.restore();
  }

  update(speedFrame: number) {
    this.position = forward(this.position, speedFrame, this.speed);
    if (this.images[0].width !== 0) this.position %= Math.floor(this.images[0].width * this.scale);

    this.images.forEach((img, index) => {
      calcCarousel(img.width * this.scale, this.canvas.width).forEach(position => {
        this.draw(position - this.position + this.canvas.w(this.margins[index] * 1000), img, this.depths[index]);
      });
    });
  }
  reset() {
    this.position = 0;
  }
}
