interface ICube {
  cubeSize: number;
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  jumpValue: number;
  isJumpping: boolean;
  startTime: number;
  update: () => void;
  jump: () => void;
}

export default class Cube implements ICube {
  public jumpValue = 0;

  public isJumpping = false;

  public startTime = Date.now();

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

  update(): void {
    this.ctx.fillStyle = "black";
    const speed = (Date.now() - this.startTime) / 100;

    const jumpHeight = Math.sin(this.jumpValue) * this.cubeSize * 1.5;

    if (this.isJumpping) this.jumpValue += speed;

    const cubeOrigin: [number, number] = [
      this.width / 2 - this.cubeSize / 2,
      this.height / 2 - this.cubeSize / 2 - jumpHeight,
    ];
    const cubeCenter: [number, number] = [cubeOrigin[0] + this.cubeSize / 2, cubeOrigin[1] + this.cubeSize / 2];

    if (jumpHeight < 0) {
      this.isJumpping = false;
      this.jumpValue = 0;
    }

    this.ctx.translate(...cubeCenter);
    this.ctx.rotate((Math.PI / 180) * this.jumpValue * 50);
    this.ctx.translate(-cubeCenter[0], -cubeCenter[1]);

    this.ctx.fillRect(...cubeOrigin, this.cubeSize, this.cubeSize);

    this.startTime = Date.now();
  }

  jump(): void {
    this.isJumpping = true;
  }
}
