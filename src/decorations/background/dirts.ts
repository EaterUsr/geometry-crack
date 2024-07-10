import { calcCarousel } from "@/utils/carousel";
import { trunc } from "@/utils/decorators";
import { config } from "@/config";
import { CanvasConfig, DecorationsConfig } from "@/types/config";
import { forward } from "@/utils/move";
import { DrawOptions } from "@/utils/layers";

const dirtConf = config.decorations.dirts;

export class DirtsController {
  private readonly speed: number;
  private readonly floorHeight: number;
  private position = 0;
  private readonly images: HTMLImageElement[] = dirtConf.imgs;
  private readonly depths = dirtConf.depths;
  private readonly margins = dirtConf.margins;
  @trunc(0)
  readonly layerCategory: LayerCategory = "dirt";

  constructor(private readonly canvas: CanvasConfig, { speed, floorHeight }: DecorationsConfig) {
    this.speed = speed;
    this.floorHeight = floorHeight;
  }

  update(speedFrame: number) {
    this.position = forward(this.position, speedFrame, this.speed);
  }

  draw({ ctx, w }: DrawOptions) {
    const scale = w(dirtConf.scale);

    if (this.images[0].width !== 0) this.position %= Math.floor(this.images[0].width * scale);

    this.images.forEach((img, index) => {
      calcCarousel(img.width * scale, this.canvas.width).forEach(position => {
        const posX = position - this.position + w(this.margins[index] * 1000);
        ctx.save();
        ctx.translate(posX, Math.floor(this.floorHeight + (this.canvas.width / 100) * this.depths[index]));
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      });
    });
  }

  reset() {
    this.position = 0;
  }
}
