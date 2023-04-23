import { BackgroundDecoration } from "@components/backgroundDecorations";
import { random } from "@utils/math";
import { trunc } from "@utils/decorators";

export class Dirt extends BackgroundDecoration {
  @trunc()
  readonly y = random(7, 7.5, this.canvas.height / 10);
  @trunc()
  readonly sizeX = random(8, 13, this.canvas.width / 10000);
  readonly sizeY = this.sizeX;
  readonly color: color = "#8B3E00";

  setPath() {
    const size = 40;
    this.path.arc(size, size, size, 0, Math.PI * 2);
  }

  draw() {
    this.canvas.ctx.fill(this.path);
  }
}
