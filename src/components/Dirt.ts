import Cloud, { ICloud } from "@components/Cloud";

interface IDirt extends ICloud {}

const dirtPath = new Path2D();
const size = 40;
dirtPath.arc(size, size, size, 0, Math.PI * 2);

export default class Dirt extends Cloud implements IDirt {
  protected path = dirtPath;
  protected color = "#8B3E00";

  constructor(ctx: CanvasRenderingContext2D, size: number, speed: number, height: number, canvasWidth: number) {
    super(ctx, size, speed, height, canvasWidth, false);
  }
}
