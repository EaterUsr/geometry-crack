import { closestDeg, toRadians } from "@/utils/math";
import { updateTarget } from "@/utils/targetPosition";
import { config } from "@/config";
import { CanvasConfig, DecorationsConfig } from "@/types/config";
import { backward } from "@/utils/move";
import { squareHitbox } from "@/utils/collision";
import { loadImage } from "@/utils/image";
import { Store } from "@/utils/store";
import { DrawOptions } from "@/utils/layers";

const cubeConf = config.components.cube;
const blocksHeight = {
  slab: 0.5,
  rock: 1,
} as const;

export class Cube {
  private readonly halfBlockSize: number;
  private floorHeight: number;
  private velocity = 0;
  private jumpVelocity = cubeConf.jumpVelocity;
  private isFrozen = false;
  private images = (Store.content.skins.find((skin: Skin) => skin.status === "equipped") as Skin).imgs.map(loadImage);
  private isTouchingTheFloor = true;
  private jumpsLeft = cubeConf.jumps;
  readonly deg: TargetPosition<number>;
  readonly origin: TargetPosition<Coords>;
  readonly layerCategory: LayerCategory = "cube";
  get hitbox() {
    return squareHitbox(
      this.origin.content[0],
      this.origin.content[1],
      360 - this.deg.content,
      this.decorations.blockSize
    );
  }
  center: Coords;

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly decorations: DecorationsConfig,
    private readonly w: (size: number) => number
  ) {
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
  }

  private updateCenter(): Coords {
    return [this.origin.content[0] + this.halfBlockSize, this.origin.content[1] + this.halfBlockSize];
  }

  draw({ ctx }: DrawOptions) {
    this.center = this.updateCenter();

    ctx.save();

    ctx.translate(...this.center);
    ctx.rotate(toRadians(this.deg.content));
    ctx.translate(-this.center[0], -this.center[1]);

    ctx.drawImage(
      this.images[this.jumpsLeft],
      ...this.origin.content,
      this.decorations.blockSize,
      this.decorations.blockSize
    );
    ctx.restore();
  }

  update(speedFrame: number, jumpsLeft: number) {
    this.jumpsLeft = jumpsLeft;

    this.velocity -= speedFrame === 0 ? this.velocity : speedFrame;
    this.origin.content[1] -= this.velocity * this.w(cubeConf.jumpSpeed);
    this.deg.content = (this.deg.content + 360) % 360;

    this.isTouchingTheFloor = this.origin.content[1] + this.decorations.blockSize >= this.floorHeight;

    if (this.isTouchingTheFloor) {
      this.origin.content[1] = this.floorHeight - this.decorations.blockSize;
      this.velocity = 0;
      this.deg.target = closestDeg(this.deg.content);
    }

    updateTarget(
      this.deg,
      speedFrame,
      (_, preventContent) => {
        if (this.isTouchingTheFloor) return;
        this.deg.content = preventContent + cubeConf.speedDeg * speedFrame;
      },
      360
    );

    updateTarget(this.origin, speedFrame, areNull => {
      if (this.isFrozen && areNull[0]) {
        this.origin.content[0] = backward(this.origin.content[0], this.decorations.speed, speedFrame);
      }
    });

    this.floorHeight = this.decorations.floorHeight;
    this.center = this.updateCenter();
  }

  onCollision = (blockPosition: Coords, blockType: "slab" | "rock") => {
    const blockHeight = blocksHeight[blockType] * this.decorations.blockSize;
    const doesExeedsTop = this.center[1] < blockPosition[1];
    const doesExeedsBlockSide = this.center[0] > blockPosition[0];
    const doesFloorExeedsBottom = this.floorHeight > blockPosition[1];

    if (doesExeedsBlockSide && doesExeedsTop) {
      this.floorHeight = blockPosition[1];
      return;
    }

    if (!doesExeedsTop && !this.isTouchingTheFloor && !this.isFrozen) {
      this.velocity = 0;
      this.origin.target[1] = null;

      if (blockPosition[1] + blockHeight + this.decorations.blockSize >= this.floorHeight) {
        this.origin.content[1] = blockPosition[1] + blockHeight;
        this.deg.content = closestDeg(this.deg.content);
        return;
      }

      this.origin.content[1] =
        blockPosition[1] + blockHeight + Math.sin(toRadians(this.deg.content % 90)) * this.halfBlockSize;
      return;
    }

    if (this.isTouchingTheFloor && doesFloorExeedsBottom) {
      this.isFrozen = true;
      this.origin.target[0] = null;
      this.origin.content[0] = blockPosition[0] - this.decorations.blockSize;
      return;
    }

    if (!doesExeedsBlockSide && doesFloorExeedsBottom) {
      this.isFrozen = true;
      const closest = closestDeg(this.deg.content);
      this.deg.target = (closest > this.deg.content ? closest + 270 : closest) % 360;
      this.origin.target[0] = blockPosition[0] - this.decorations.blockSize;
      return;
    }
  };

  jump(cb: () => void) {
    if (this.isFrozen) return;
    if (this.isTouchingTheFloor) {
      this.velocity = this.jumpVelocity;
      cb();
    }
  }

  isJumping() {
    return this.center[1] + this.halfBlockSize < this.decorations.floorHeight;
  }

  reset() {
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

  setSkin = (skinsUrl: string[]) => {
    this.images = skinsUrl.map(loadImage);
  };
}
