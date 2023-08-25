import { BackgroundDecoration } from "@components/backgroundDecoration";
import { random, randomMinMax } from "@utils/math";
import { config } from "@config";
import { loadImage } from "@utils/image";

const cloudConf = config.decorations.clouds;

export class Cloud extends BackgroundDecoration {
  readonly y = randomMinMax(cloudConf.y, this.canvas.height / 10);
  readonly isReturned = Boolean(Math.floor(random(0, 2)));
  readonly sizeY = randomMinMax(cloudConf.sizeY, this.canvas.width / 1000);
  readonly sizeX = this.isReturned ? -this.sizeY : this.sizeY;
  protected image = loadImage(cloudConf.url);

  draw() {
    if (this.isReturned) this.canvas.ctx.translate(this.sizeY * -cloudConf.originalSize, 0);

    this.canvas.ctx.drawImage(
      this.image,
      0,
      0,
      this.sizeX * cloudConf.originalSize,
      Math.floor(this.sizeY * cloudConf.originalSize * 0.62)
    );
  }
}