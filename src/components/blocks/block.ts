import { CanvasConfig } from "@/types/config";
import { backward } from "@/utils/move";

export abstract class Block {
  abstract readonly hitbox: Hitbox;
  protected abstract readonly image: HTMLImageElement;
  abstract readonly type: BlockType;

  constructor(
    protected readonly canvas: CanvasConfig,
    public position: Coords,
    public speed: number,
    public size: number
  ) {}

  protected abstract drawPatern(ctx: CanvasRenderingContext2D): void;

  update(speedFrame: number) {
    this.position[0] = backward(this.position[0], this.speed, speedFrame);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(...this.position);
    this.drawPatern(ctx);
    ctx.restore();
  }
}
