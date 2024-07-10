import { calcCarousel } from "@/utils/carousel";
import { trunc } from "@/utils/decorators";
import { config } from "@/config";
import { CanvasConfig, DecorationsConfig } from "@/types/config";
import { forward } from "@/utils/move";
import { DrawOptions } from "@/utils/layers";

const grassConf = config.decorations.grass;

export class GrassController {
  private readonly speed: number;
  private readonly floorHeight: number;
  private position = 0;
  private readonly image: HTMLImageElement = grassConf.img;
  @trunc(0)
  readonly layerCategory: LayerCategory = "grass";

  constructor(private readonly canvas: CanvasConfig, { speed, floorHeight }: DecorationsConfig) {
    this.floorHeight = floorHeight;
    this.speed = speed;
  }

  update(speedFrame: number) {
    this.position = forward(this.position, this.speed, speedFrame);
  }

  draw({ ctx, w }: DrawOptions) {
    const scale = w(grassConf.scale);

    if (this.image.width !== 0) this.position %= Math.floor(this.image.width * scale);

    calcCarousel(this.image.width * scale, this.canvas.width).forEach(position => {
      const posX = position - this.position;
      ctx.save();
      ctx.translate(posX, this.floorHeight - this.image.height * scale + 1);
      ctx.scale(scale, scale);
      ctx.drawImage(this.image, 0, 0);
      ctx.restore();
    });
  }

  reset() {
    this.position = 0;
  }
}
