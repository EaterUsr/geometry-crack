export interface ICloud {
  position: number;
  size: number;
  speed: number;
  height: number;
  canvasWidth: number;
  update: (speed: number) => void;
}

const cloudPath = new Path2D();

cloudPath.moveTo(20, 50);
cloudPath.arcTo(-30, 40, 20, 20, 15);
cloudPath.arcTo(20, -15, 60, 20, 17);
cloudPath.arcTo(70, -10, 80, 25, 17);
cloudPath.arcTo(100, -10, 100, 25, 15);
cloudPath.arcTo(150, 35, 110, 50, 15);
cloudPath.arcTo(110, 100, 70, 60, 15);
cloudPath.arcTo(65, 80, 40, 50, 17);
cloudPath.arcTo(30, 80, 20, 50, 17);
cloudPath.closePath();

export default class Cloud implements ICloud {
  public position = 0;
  protected path = cloudPath;
  protected color = "white";

  constructor(
    private ctx: CanvasRenderingContext2D,
    public size: number,
    public speed: number,
    public height: number,
    public canvasWidth: number,
    public isReturn: boolean
  ) {}
  update(speed: number): void {
    const distance = this.canvasWidth - this.position + (this.isReturn ? this.size : 0);

    const sizeX = this.isReturn ? -this.size : this.size;

    this.ctx.save();
    this.ctx.translate(distance, this.height);
    this.ctx.scale((1 / 140) * sizeX, (1 / 140) * this.size);

    this.ctx.fillStyle = this.color;

    this.ctx.fill(this.path);
    this.ctx.restore();

    this.position += this.speed * speed;
  }
}
