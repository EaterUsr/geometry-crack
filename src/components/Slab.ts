import Block, { IBlock } from "./Block";

interface ISlab extends IBlock {}

export default class Slab extends Block implements ISlab {
  protected drawPatern(): void {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(this.positionX, this.positionY);

    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.size, 0);
    this.ctx.lineTo(this.size, this.size / 2);
    this.ctx.lineTo(0, this.size / 2);
    this.ctx.closePath();

    this.ctx.fillStyle = "black";
    this.ctx.fill();

    this.ctx.restore();
  }
}
