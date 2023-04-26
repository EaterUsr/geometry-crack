import { calcCarousel } from "@utils/carousel";
import { trunc } from "@utils/decorators";
import { loadImage } from "@utils/image";

export class DirtsController {
  private readonly speed: number;
  private readonly floorHeight: number;
  private position = 0;
  private readonly images = [
    loadImage("img/dirt/depth-1.svg"),
    loadImage("img/dirt/depth-2.svg"),
    loadImage("img/dirt/depth-3.svg"),
  ];
  private readonly depths = [1, 2, 3];
  private readonly margins = [0, 1, 0];
  @trunc(0)
  readonly scale: number;

  constructor(private readonly canvas: canvasConfig, { speed, floorHeight }: graphicsConfig) {
    this.speed = speed;
    this.floorHeight = floorHeight;
    this.scale = (this.canvas.width / 10000) * 6;
  }

  private draw(position: number, img: HTMLImageElement, depth: number) {
    this.canvas.ctx.save();
    this.canvas.ctx.translate(position, Math.floor(this.floorHeight + (this.canvas.width / 100) * 5 * depth));
    this.canvas.ctx.scale(this.scale, this.scale);
    this.canvas.ctx.drawImage(img, 0, 0);
    this.canvas.ctx.restore();
  }

  update(speedFrame: number) {
    this.position += speedFrame * this.speed;
    if (this.images[0].width !== 0) this.position %= this.images[0].width * this.scale;

    this.images.forEach((img, index) => {
      calcCarousel(img.width * this.scale, this.canvas.width).forEach(position => {
        this.draw(
          position - this.position + this.margins[index] * (this.canvas.width / 10),
          img,
          this.depths[index] * 1
        );
      });
    });
  }
}
