export interface IBlock {
  positionX: number;
  positionY: number;
  speed: number;
  update: (speed: number) => void;
}

export default abstract class Block implements IBlock {
  constructor(
    protected ctx: CanvasRenderingContext2D,
    public positionX: number,
    public positionY: number,
    public speed: number,
    public size: number,
    public canvasWidth: number
  ) {}

  protected drawPatern(): void {}

  protected updatePosition(speed: number): void {
    this.positionX -= this.speed * speed;
  }

  update(speed: number): void {
    this.drawPatern();
    this.updatePosition(speed);
  }
}
