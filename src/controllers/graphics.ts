import { CloudsController } from "@controllers/backgroundDecorations/clouds";
import { DirtsController } from "@controllers/backgroundDecorations/dirts";

export class GraphicsController {
  readonly colors: colorScheme = {
    sky: "#00C2FF",
    floor: "#9B5400",
    grass: "#1CA600",
  };
  readonly config: graphicsConfig;
  readonly clouds: CloudsController;
  readonly dirts: DirtsController;

  constructor(private readonly canvas: canvasConfig) {
    const speed = canvas.width / 1460;
    const blockSize = Math.floor(canvas.height / 9);
    const cubeOrigin: coords = [
      Math.floor(canvas.width / 2 - blockSize / 2),
      Math.floor(canvas.height / 2 - blockSize / 2),
    ];
    const timePerBlock = Math.floor(blockSize / speed);
    const floorHeight = Math.floor(cubeOrigin[1] + blockSize);
    const grassHeight = Math.floor(canvas.height / 20);

    this.config = {
      speed,
      blockSize,
      cubeOrigin,
      timePerBlock,
      floorHeight,
      grassHeight,
    };

    this.clouds = new CloudsController(this.canvas, this.config);
    this.dirts = new DirtsController(this.canvas, this.config);
  }

  updateBackground(speedFrame: number) {
    this.setSky();
    this.clouds.update(speedFrame);
  }
  updateForeground(speedFrame: number) {
    this.setFloor();
    this.setGrass();
    this.dirts.update(speedFrame);
  }
  private setSky() {
    this.canvas.ctx.fillStyle = this.colors.sky;
    this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  private setFloor() {
    this.canvas.ctx.fillStyle = this.colors.floor;
    this.canvas.ctx.fillRect(
      0,
      this.config.floorHeight,
      this.canvas.width,
      Math.floor(this.canvas.height / 2 - this.config.blockSize / 2)
    );
  }
  private setGrass() {
    this.canvas.ctx.fillStyle = this.colors.grass;
    this.canvas.ctx.fillRect(0, this.config.floorHeight, this.canvas.width, this.config.grassHeight);
  }
}
