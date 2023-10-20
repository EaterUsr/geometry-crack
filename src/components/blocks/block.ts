import { backward } from "@/utils/move";

export abstract class Block {
  protected readonly ctx: CanvasRenderingContext2D;
  abstract readonly hitbox: Hitbox;
  protected abstract readonly image: HTMLImageElement;
  abstract readonly type: BlockType;

  constructor({ ctx }: CanvasConfig, public position: Coords, public speed: number, public size: number) {
    this.ctx = ctx;
  }

  protected abstract drawPatern(): void;

  update(speedFrame: number) {
    this.position[0] = backward(this.position[0], this.speed, speedFrame);

    this.ctx.save();
    this.ctx.translate(...this.position);
    this.drawPatern();
    this.ctx.restore();
  }
}
