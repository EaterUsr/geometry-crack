import { closestDeg, toDegrees } from "@utils/math";
import { updateTarget } from "@utils/targetPosition";
import { backward } from "@utils/move";
import { config } from "@config";
import { loadImage } from "@utils/image";

const cubeConf = config.components.cube;

export class Cube {
  private floorHeight: number;
  private speedFrame = 0;
  readonly deg: TargetPosition<number>;
  readonly origin: TargetPosition<Coords>;
  private velocity = 0;
  private isFalling = true;
  private canForward = true;
  readonly size: number;
  private readonly images = cubeConf.urls.map(loadImage);
  get hitbox() {
    return cubeConf.getHitbox(this);
  }
  center: Coords;
  jumpHeight = 0;

  constructor(private readonly canvas: CanvasConfig, private readonly decorations: DecorationsConfig) {
    this.origin = {
      content: decorations.cubeOrigin,
      target: [null, null],
      speed: decorations.speed,
    };

    this.deg = {
      content: 0,
      speed: cubeConf.speedDeg,
      target: null,
    };

    this.floorHeight = decorations.floorHeight;
    this.size = this.decorations.blockSize;
    this.center = this.updateCenter();
  }
  private updateCenter(): Coords {
    return [this.origin.content[0] + this.size / 2, this.origin.content[1] - this.jumpHeight + this.size / 2];
  }
  private isTouchingTheFloor() {
    return this.origin.content[1] - this.jumpHeight + this.size >= this.floorHeight;
  }

  update(speedFrame: number, jumpsLeft: number) {
    this.speedFrame = speedFrame;

    this.velocity -= this.velocity === 0 ? 0 : 1;

    this.jumpHeight += this.velocity * speedFrame * this.canvas.w(cubeConf.jumpSpeed / 10);

    this.deg.content %= 360;

    if (this.isTouchingTheFloor() && this.isFalling) {
      this.isFalling = false;
      this.jumpHeight = 0;
      this.velocity = 0;
      this.deg.target = closestDeg(this.deg.content);
      this.origin.content[1] = this.floorHeight - this.size;
    }

    updateTarget(
      this.deg,
      speedFrame,
      (_, preventContent) => {
        if (this.isFalling) {
          this.deg.content = preventContent + this.deg.speed * this.speedFrame;
        }
      },
      360
    );
    updateTarget(this.origin, speedFrame, ([x, y]) => {
      if (this.isFalling && y) this.jumpHeight -= this.canvas.w(cubeConf.gravity) * speedFrame;
      if (!this.canForward && x) {
        this.origin.content[0] = backward(this.origin.content[0], this.decorations.speed, speedFrame);
      }
    });

    const originWithJump: Coords = [this.origin.content[0], this.origin.content[1] - this.jumpHeight];
    this.center = this.updateCenter();

    this.canvas.ctx.save();

    this.canvas.ctx.translate(...this.center);
    this.canvas.ctx.rotate(toDegrees(this.deg.content));
    this.canvas.ctx.translate(-this.center[0], -this.center[1]);

    this.canvas.ctx.drawImage(this.images[jumpsLeft], ...originWithJump, this.size, this.size);
    this.canvas.ctx.restore();

    this.canForward = true;
  }

  jump() {
    if (this.isTouchingTheFloor()) {
      this.velocity = cubeConf.jumpVelocity;
      this.isFalling = true;
    }
  }

  onSlabCollision(slabPosition: Coords) {
    if (this.center[0] >= slabPosition[0]) {
      setTimeout(() => {
        this.isFalling = true;
        this.floorHeight = this.decorations.floorHeight;
      }, this.decorations.timePerBlock);
      this.floorHeight = slabPosition[1];
      return;
    }
    this.isFalling = true;
    this.origin.target = [slabPosition[0] - this.size, this.floorHeight - this.size];
    this.canForward = false;
  }
  reset() {
    this.velocity = 0;
    this.jumpHeight = 0;
    this.origin.target = [null, null];
    this.origin.content = [Math.floor(this.canvas.width / 2 - this.size / 2), this.floorHeight - this.size];

    this.deg.target = null;
    this.deg.content = 0;
  }
}
