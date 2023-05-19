import { BackgroundDecoration } from "@components/backgroundDecoration";
import { random, randomMinMax } from "@utils/math";
import { config } from "@config";

const cloudConf = config.decorations.clouds;

export class Cloud extends BackgroundDecoration {
  readonly y = randomMinMax(cloudConf.y, this.canvas.height / 10);
  readonly isReturned = Boolean(Math.floor(random(0, 2)));
  readonly sizeY = randomMinMax(cloudConf.sizeY, this.canvas.width / 1000);
  readonly sizeX = this.isReturned ? -this.sizeY : this.sizeY;
  readonly color = cloudConf.color;

  setPath() {
    this.path.moveTo(20, 50);
    this.path.arcTo(-30, 40, 20, 20, 15);
    this.path.arcTo(20, -15, 60, 20, 17);
    this.path.arcTo(70, -10, 80, 25, 17);
    this.path.arcTo(100, -10, 100, 25, 15);
    this.path.arcTo(150, 35, 110, 50, 15);
    this.path.arcTo(110, 100, 70, 60, 15);
    this.path.arcTo(65, 80, 40, 50, 17);
    this.path.arcTo(30, 80, 20, 50, 17);
    this.path.closePath();
  }

  draw() {
    if (this.isReturned) this.canvas.ctx.translate(this.sizeY * -cloudConf.originalSize, 0);

    this.canvas.ctx.fill(this.path);
  }
}
