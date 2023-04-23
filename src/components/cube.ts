import { squareHitbox } from "@utils/collision";
import { closestDeg, toDegrees } from "@utils/math";
import { updateTarget } from "@utils/targetPosition";
import { backward } from "@utils/move";

export class Cube {
  private readonly ctx: CanvasRenderingContext2D;
  private floorHeight: number;
  private speedFrame = 0;
  private readonly deg: targetPosition<number>;
  readonly origin: targetPosition<coords>;
  private velocity = 0;
  private isFalling = true;
  private canForward = true;
  readonly size: number;
  get hitbox() {
    return squareHitbox(
      this.origin.content[0],
      this.origin.content[1] - this.jumpHeight,
      360 - this.deg.content,
      this.size
    );
  }
  center: coords;
  jumpHeight = 0;

  constructor({ ctx }: canvasConfig, private readonly graphics: graphicsConfig) {
    this.origin = {
      content: graphics.cubeOrigin,
      target: [null, null],
      speed: graphics.speed,
    };

    this.deg = {
      content: 0,
      speed: 0.6,
      target: null,
    };

    this.ctx = ctx;
    this.floorHeight = graphics.floorHeight;
    this.size = this.graphics.blockSize;
    this.center = this.updateCenter();
  }
  private updateCenter(): coords {
    return [this.origin.content[0] + this.size / 2, this.origin.content[1] - this.jumpHeight + this.size / 2];
  }
  private touchTheFloor() {
    return this.origin.content[1] - this.jumpHeight + this.size >= this.floorHeight;
  }

  update(speedFrame: number) {
    this.speedFrame = speedFrame;
    this.ctx.fillStyle = "#000";

    this.velocity -= this.velocity === 0 ? 0 : 1;

    this.jumpHeight += this.velocity * speedFrame * 0.05;

    this.deg.content %= 360;

    if (this.touchTheFloor() && this.isFalling) {
      this.isFalling = false;
      this.jumpHeight = 0;
      this.velocity = 0;
      this.deg.target = closestDeg(this.deg.content);
      this.deg.target %= 360;
      this.origin.content[1] = this.floorHeight - this.size;
    }
    updateTarget(
      this.deg,
      speedFrame,
      (_, preventContent) => {
        if (this.isFalling) {
          this.deg.content = preventContent + 0.5 * this.speedFrame;
        }
      },
      360
    );
    updateTarget(this.origin, speedFrame, ([x, y]) => {
      if (this.isFalling && y) this.jumpHeight -= 7;
      if (!this.canForward && x) {
        this.origin.content[0] = backward(this.origin.content[0], this.graphics.speed, speedFrame);
      }
    });

    const originWithJump: coords = [this.origin.content[0], this.origin.content[1] - this.jumpHeight];
    this.center = this.updateCenter();

    this.ctx.save();

    this.ctx.translate(...this.center);
    this.ctx.rotate(toDegrees(this.deg.content));
    this.ctx.translate(-this.center[0], -this.center[1]);

    this.ctx.fillRect(...originWithJump, this.size, this.size);

    this.ctx.restore();
    this.canForward = true;
  }

  jump() {
    if (this.touchTheFloor()) {
      this.velocity = 22;
      this.isFalling = true;
    }
  }

  onSlabCollision(slabPosition: coords) {
    if (this.center[0] >= slabPosition[0]) {
      setTimeout(() => {
        this.isFalling = true;
        this.floorHeight = this.graphics.floorHeight;
      }, this.graphics.timePerBlock);
      this.floorHeight = slabPosition[1];
      this.origin.target = [null, slabPosition[1] - this.size];
      return;
    }
    this.isFalling = true;
    this.origin.target = [slabPosition[0] - this.size, this.floorHeight - this.size];
    this.canForward = false;
  }
}
