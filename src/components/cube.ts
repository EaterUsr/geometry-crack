import { closestDeg, toDegrees } from "@/utils/math";
import { updateTarget } from "@/utils/targetPosition";
import { config } from "@/config";
import { skins } from "@/config/skins";
import { backward } from "@/utils/move";
import { squareHitbox } from "@/utils/collision";
import { ParticulesController } from "@/decorations/particules";

const cubeConf = config.components.cube;
const particulesConf = config.decorations.particules.grass;

export class Cube {
  private floorHeight: number;
  private speedFrame = 0;
  readonly deg: TargetPosition<number>;
  readonly origin: TargetPosition<Coords>;
  private velocity = 0;
  private isFalling = true;
  private readonly halfBlockSize: number;
  get hitbox() {
    return squareHitbox(
      this.origin.content[0],
      this.origin.content[1],
      360 - this.deg.content,
      this.decorations.blockSize
    );
  }
  center: Coords;
  private lastSlabCollision: null | number = null;
  private jumpVelocity = cubeConf.jumpVelocity;
  private isFrozen = false;
  private particules: ParticulesController;
  private ignoreCollisionHeight = new Set<number>();
  skin: SkinName = "default";
  private images = (skins.find(skin => this.skin === skin.name) as Skin).imgs;

  constructor(private readonly canvas: CanvasConfig, private readonly decorations: DecorationsConfig) {
    this.origin = {
      content: decorations.cubeOrigin,
      target: [null, null],
      speed: [decorations.speed * 2, decorations.speed],
    };

    this.deg = {
      content: 0,
      speed: cubeConf.speedDegCollision,
      target: null,
    };

    this.halfBlockSize = Math.floor(decorations.blockSize / 2);
    this.floorHeight = decorations.floorHeight;
    this.center = this.updateCenter();
    this.particules = new ParticulesController(
      canvas,
      [decorations.cubeOrigin[0], this.center[1] + decorations.blockSize],
      particulesConf
    );
  }

  private updateCenter(): Coords {
    return [this.origin.content[0] + this.halfBlockSize, this.origin.content[1] + this.halfBlockSize];
  }

  private isTouchingTheFloor() {
    return this.origin.content[1] + this.decorations.blockSize >= this.floorHeight;
  }

  update(speedFrame: number, jumpsLeft: number) {
    this.speedFrame = speedFrame;

    this.particules.update(speedFrame);

    this.velocity -= speedFrame;

    this.origin.content[1] -= this.velocity * this.canvas.w((cubeConf.jumpSpeed / 10) * speedFrame);

    if (Date.now() - (this.lastSlabCollision ?? Date.now()) >= this.decorations.timePerBlock) {
      this.isFalling = true;
      this.floorHeight = this.decorations.floorHeight;
      this.lastSlabCollision = null;
    }

    if (this.isTouchingTheFloor()) {
      this.origin.content[1] = this.floorHeight - this.decorations.blockSize;
      this.velocity = 0;
    }

    this.deg.content = (this.deg.content + 360) % 360;

    if (this.isTouchingTheFloor() && this.isFalling) {
      this.particules.isActive = true;
      this.isFalling = false;
      this.velocity = 0;
      this.origin.content[1] = this.floorHeight - this.decorations.blockSize;
      this.deg.target = closestDeg(this.deg.content);
      this.origin.content[1] = this.floorHeight - this.decorations.blockSize;
    }

    updateTarget(
      this.deg,
      speedFrame,
      (_, preventContent) => {
        if (this.isFalling) {
          this.deg.content = preventContent + cubeConf.speedDeg * this.speedFrame;
        }
      },
      360
    );
    updateTarget(this.origin, speedFrame, areNull => {
      if (this.isFrozen && areNull[0] === true) {
        this.origin.content[0] = backward(this.origin.content[0], this.decorations.speed, speedFrame);
      }
    });

    this.center = this.updateCenter();
    this.ignoreCollisionHeight.clear();

    this.canvas.ctx.save();

    this.canvas.ctx.translate(...this.center);
    this.canvas.ctx.rotate(toDegrees(this.deg.content));
    this.canvas.ctx.translate(-this.center[0], -this.center[1]);

    this.canvas.ctx.drawImage(
      this.images[jumpsLeft],
      ...this.origin.content,
      this.decorations.blockSize,
      this.decorations.blockSize
    );
    this.canvas.ctx.restore();
  }

  jump(cb: () => void) {
    if (this.isFrozen) return;
    if (this.isTouchingTheFloor()) {
      this.particules.isActive = false;
      this.velocity = this.jumpVelocity;
      this.isFalling = true;
      cb();
    }
  }

  onSlabCollision = (slabPosition: Coords) => {
    if (this.ignoreCollisionHeight.has(slabPosition[1] + this.halfBlockSize)) return;

    const isTouchingBottom = this.center[1] > slabPosition[1] + this.halfBlockSize;
    const doesCenterExeedsSlabSide = this.center[0] > slabPosition[0];

    if (isTouchingBottom && doesCenterExeedsSlabSide) {
      this.origin.target = [null, null];
      this.velocity = 0;
      this.isFrozen = false;
      this.ignoreCollisionHeight.add(slabPosition[1] + this.halfBlockSize);
      return;
    }

    if (!doesCenterExeedsSlabSide && this.floorHeight > slabPosition[1]) {
      this.isFrozen = true;
      const closest = closestDeg(this.deg.content);
      this.deg.target = (closest + 360 > this.deg.content + 360 ? closest + 270 : closest) % 360;

      if (this.isTouchingTheFloor()) {
        this.origin.content[0] = slabPosition[0] - this.decorations.blockSize;
        this.origin.target[0] = null;
        return;
      }

      this.origin.target[0] = slabPosition[0] - this.decorations.blockSize;

      return;
    }

    if (
      Date.now() - (this.lastSlabCollision ?? Date.now()) >= this.decorations.timePerBlock ||
      this.lastSlabCollision === null
    ) {
      this.lastSlabCollision = Date.now();
    }

    if (this.center[0] < slabPosition[0] + this.halfBlockSize) {
      this.deg.target = closestDeg(this.deg.content);
      this.origin.target[1] = slabPosition[1] - this.decorations.blockSize;
    }

    this.origin.target = [null, null];
    this.floorHeight = slabPosition[1];
    this.isFalling = true;
  };

  reset() {
    this.particules.reset();
    this.velocity = 0;
    this.isFrozen = false;
    this.jumpVelocity = cubeConf.jumpVelocity;
    this.origin.target = [null, null];
    this.origin.content = [
      Math.floor(cubeConf.positionX * this.canvas.width),
      this.floorHeight - this.decorations.blockSize,
    ];

    this.deg.target = null;
    this.deg.content = 0;
  }

  setSkin = (skinName: SkinName) => {
    this.skin = skinName;
    this.images = (skins.find(skin => this.skin === skin.name) as Skin).imgs;
  };
}
