import { calcCarousel } from "@/utils/carousel";
import { trunc } from "@/utils/decorators";
import { config } from "@/config";
import { CanvasConfig, DecorationsConfig } from "@/types/config";
import { forward } from "@/utils/move";
import { DrawOptions } from "@/utils/layers";

const cloudsConf = config.decorations.clouds;

export class CloudsController {
  @trunc(0)
  readonly speed: number;
  private position = 0;
  private readonly image: HTMLImageElement = cloudsConf.img;
  readonly layerCategory: LayerCategory = "clouds";

  constructor(private readonly canvas: CanvasConfig, { speed }: DecorationsConfig) {
    this.speed = speed / cloudsConf.depth;
  }

  update(speedFrame: number) {
    this.position = forward(this.position, speedFrame, this.speed);
  }

  draw({ ctx, w }: DrawOptions) {
    const scale = w(cloudsConf.scale);

    if (this.image.width !== 0) this.position %= Math.floor(this.image.width * scale);

    calcCarousel(this.image.width * scale, this.canvas.width).forEach(position => {
      const posX = position - this.position;

      ctx.save();
      ctx.translate(posX, 0);
      ctx.scale(scale, scale);
      ctx.drawImage(this.image, 0, 0);
      ctx.restore();
    });
  }

  reset() {
    this.position = 0;
  }
}
