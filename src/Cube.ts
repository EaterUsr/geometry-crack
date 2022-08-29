interface ICube {
  cubeSize: number;
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  jumpValue: number;
  isJumpping: boolean;
  update: (speed: number) => void;
  jump: () => void;
}

export default class Cube implements ICube {
  public jumpValue = 0;

  public isJumpping = false;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    public cubeSize: number
  ) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.cubeSize = cubeSize;
  }

  update(speed: number): void {
    this.ctx.fillStyle = "black";

    let jumpHeight = Math.sin(this.jumpValue) * this.cubeSize * 1.5;

    if (jumpHeight < 0) {
      this.isJumpping = false;
      this.jumpValue = 0;
      jumpHeight = 0;
    }

    if (this.isJumpping) this.jumpValue += speed * 0.01;

    const cubeOrigin: [number, number] = [
      this.width / 2 - this.cubeSize / 2,
      this.height / 2 - this.cubeSize / 2 - jumpHeight,
    ];
    const cubeCenter: [number, number] = [cubeOrigin[0] + this.cubeSize / 2, cubeOrigin[1] + this.cubeSize / 2];

    this.ctx.save();

    this.ctx.translate(...cubeCenter);
    this.ctx.rotate((Math.PI / 180) * this.jumpValue * 50);
    this.ctx.translate(-cubeCenter[0], -cubeCenter[1]);

    this.ctx.fillRect(...cubeOrigin, this.cubeSize, this.cubeSize);

    this.ctx.restore();
  }

  jump(): void {
    this.isJumpping = true;
  }
}
