import { closestDeg, toDegrees } from "@utils/math";
import { updateTarget } from "@utils/targetPosition";
import { config } from "@config";
import { isCollision } from "@utils/collision";

const cubeConf = config.components.cube;

export class Cube {
  private floorHeight: number;
  private speedFrame = 0;
  readonly deg: TargetPosition<number>;
  readonly origin: TargetPosition<Coords>;
  private velocity = 0;
  private isFalling = true;
  readonly size: number;
  private readonly images: HTMLImageElement[] = cubeConf.imgs;
  get hitbox() {
    return cubeConf.getHitbox(this);
  }
  center: Coords;
  private lastSlabCollision: null | number = null;
  private jumpVelocity = cubeConf.jumpVelocity;

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
    return [this.origin.content[0] + this.size / 2, this.origin.content[1] + this.size / 2];
  }
  private isTouchingTheFloor() {
    return this.origin.content[1] + this.size >= this.floorHeight;
  }

  update(speedFrame: number, jumpsLeft: number) {
    this.speedFrame = speedFrame;

    this.velocity -= speedFrame;

    this.origin.content[1] -= this.velocity * this.canvas.w((cubeConf.jumpSpeed / 10) * speedFrame);

    if (Date.now() - (this.lastSlabCollision ?? Date.now()) >= this.decorations.timePerBlock) {
      this.isFalling = true;
      this.floorHeight = this.decorations.floorHeight;
      this.lastSlabCollision = null;
    }

    if (this.isTouchingTheFloor()) {
      this.origin.content[1] = this.floorHeight - this.size;
      this.velocity = 0;
    }
    this.deg.content %= 360;

    if (this.isTouchingTheFloor() && this.isFalling) {
      this.isFalling = false;
      this.velocity = 0;
      this.origin.content[1] = this.floorHeight - this.size;
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
    updateTarget(this.origin, speedFrame);

    this.center = this.updateCenter();

    this.canvas.ctx.save();

    this.canvas.ctx.translate(...this.center);
    this.canvas.ctx.rotate(toDegrees(this.deg.content));
    this.canvas.ctx.translate(-this.center[0], -this.center[1]);

    this.canvas.ctx.drawImage(this.images[jumpsLeft], ...this.origin.content, this.size, this.size);
    this.canvas.ctx.restore();
  }

  jump(cb: () => void) {
    if (this.isTouchingTheFloor()) {
      this.velocity = this.jumpVelocity;
      this.isFalling = true;
      cb();
    }
  }
  private freeze() {
    this.jumpVelocity = 0;
  }

  onSlabCollision(slabPosition: Coords, slabHitbox: Hitbox) {
    if (this.center[0] >= slabPosition[0]) {
      if (this.center[1] > slabPosition[1]) {
        if (isCollision(this.hitbox, slabHitbox)) {
          this.velocity = 0;
        }
        return;
      }
      if (
        Date.now() - (this.lastSlabCollision ?? Date.now()) >= this.decorations.timePerBlock ||
        this.lastSlabCollision === null
      ) {
        this.lastSlabCollision = Date.now();
      }
      this.floorHeight = slabPosition[1];
      return;
    }
    if (this.floorHeight <= slabPosition[1]) return;
    if (this.center[1] > slabPosition[1] + this.decorations.blockSize / 2) return;
    this.isFalling = true;
    this.origin.target[0] = slabPosition[0] - this.size;
    this.freeze();
  }
  reset() {
    this.velocity = 0;
    this.jumpVelocity = cubeConf.jumpVelocity;
    this.origin.target = [null, null];
    this.origin.content = [Math.floor(this.canvas.width / 2 - this.size / 2), this.floorHeight - this.size];

    this.deg.target = null;
    this.deg.content = 0;
  }
}
