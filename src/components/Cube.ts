function difference(nbr1: number, nbr2: number) {
  if (nbr1 > nbr2) {
    return nbr1 - nbr2;
  }
  return nbr2 - nbr1;
}

let cornersDeg = [...Array(5)];

cornersDeg = cornersDeg.map((_, index) => {
  return index * 90;
});

function getClosestDeg(deg: number): number {
  let distances = [...new Array(5)];

  distances = distances.map((_, index) => {
    return difference(cornersDeg[index], deg);
  });

  let smallestDistance: number = 361;
  let smallestDistanceIndex: number = 0;

  distances.map((deg, index) => {
    if (smallestDistance > deg) {
      smallestDistance = deg;
      smallestDistanceIndex = index;
    }
  });

  return cornersDeg[smallestDistanceIndex];
}

interface ICube {
  size: number;
  originX: number;
  originY: number;
  update: (speed: number, cubeCanForward: boolean) => void;
  jump: () => void;
  deg: number;
  jumpHeight: number;
  floorHeight: number;
  speed: number;
}

export default class Cube implements ICube {
  private velocity = 0;
  public jumpHeight = 0;
  public deg: number = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public originX: number,
    public originY: number,
    public size: number,
    public floorHeight: number,
    public speed: number
  ) {}
  private cubeTouchTheFloor(): boolean {
    return this.originY - this.jumpHeight + this.size >= this.floorHeight;
  }

  update(speed: number, cubeCanForward: boolean | null): void {
    this.ctx.fillStyle = "black";

    this.velocity -= this.velocity === 0 ? 0 : 1;

    this.jumpHeight += this.velocity * speed * 0.05;

    if (this.cubeTouchTheFloor()) {
      this.jumpHeight = 0;
      this.velocity = 0;
      this.deg %= 360;
      this.deg = getClosestDeg(this.deg);
      this.originY = this.floorHeight - this.size;
    } else {
      this.deg += 8;
      this.jumpHeight -= 7;
    }

    if (!cubeCanForward) this.originX -= this.speed * speed;

    const cubeOrigin: [x: number, y: number] = [this.originX, this.originY - this.jumpHeight];
    const cubeCenter: [x: number, y: number] = [cubeOrigin[0] + this.size / 2, cubeOrigin[1] + this.size / 2];

    this.ctx.save();

    this.ctx.translate(...cubeCenter);
    this.ctx.rotate((this.deg * Math.PI) / 180);
    this.ctx.translate(-cubeCenter[0], -cubeCenter[1]);

    this.ctx.fillRect(...cubeOrigin, this.size, this.size);

    this.ctx.restore();
  }

  jump(): void {
    if (this.cubeTouchTheFloor()) this.velocity = 22;
  }
}
