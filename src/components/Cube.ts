interface ICube {
  size: number;
  originX: number;
  originY: number;
  update: (speed: number) => void;
  jump: () => void;
  deg: number;
  jumpHeight: number;
}

export default class Cube implements ICube {
  private jumpValue = 0;
  public jumpHeight = 0;

  private isJumpping = false;
  public deg: number = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public originX: number,
    public originY: number,
    public size: number
  ) {}

  update(speed: number): void {
    this.ctx.fillStyle = "black";

    this.jumpHeight = Math.sin(this.jumpValue) * this.size * 1.5;

    if (this.jumpHeight < 0) {
      this.isJumpping = false;
      this.jumpValue = 0;
      this.jumpHeight = 0;
    }

    if (this.isJumpping) this.jumpValue += speed * 0.01;

    const cubeOrigin: [x: number, y: number] = [this.originX, this.originY - this.jumpHeight];
    const cubeCenter: [x: number, y: number] = [cubeOrigin[0] + this.size / 2, cubeOrigin[1] + this.size / 2];

    this.ctx.save();

    this.ctx.translate(...cubeCenter);
    this.deg = (Math.PI / 180) * this.jumpValue * 50;
    this.ctx.rotate(this.deg);
    this.ctx.translate(-cubeCenter[0], -cubeCenter[1]);

    this.ctx.fillRect(...cubeOrigin, this.size, this.size);

    this.ctx.restore();
  }

  jump(): void {
    this.isJumpping = true;
  }
}
