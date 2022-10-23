import Block, { IBlock } from "@components/Block";

interface ISpike extends IBlock {}

export default class Spike extends Block implements ISpike {
  protected drawPatern(): void {
    this.ctx.save();
    this.ctx.translate(this.positionX, this.positionY);
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.size);
    this.ctx.lineTo(this.size / 2, 0);
    this.ctx.lineTo(this.size, this.size);
    this.ctx.closePath();
    this.ctx.fillStyle = "red";
    this.ctx.fill();

    this.ctx.restore();
  }
}
