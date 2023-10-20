import { config } from "@/config";
import { CloudsController } from "@/decorations/background/clouds";
import { DirtsController } from "./background/dirts";
import { truncNbr } from "@/utils/math";
import { GrassController } from "./background/grass";

const decorationsConf = config.decorations;

export class DecorationsController {
  readonly colors = decorationsConf.colors;
  readonly config: DecorationsConfig;
  readonly clouds: CloudsController;
  readonly dirts: DirtsController;
  readonly grass: GrassController;

  constructor(private readonly canvas: CanvasConfig) {
    const speed = truncNbr(canvas.width / decorationsConf.speed);
    const blockSize = Math.floor(canvas.height / decorationsConf.blockSize);
    const cubeOrigin: Coords = [
      Math.floor(config.components.cube.positionX * canvas.width),
      Math.floor(canvas.height * decorationsConf.floorHeight - blockSize),
    ];
    const timePerBlock = Math.floor(blockSize / speed);
    const floorHeight = Math.floor(decorationsConf.floorHeight * canvas.height);
    const grassHeight = Math.floor(canvas.height / decorationsConf.grassHeight);

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
    this.grass = new GrassController(this.canvas, this.config);
  }

  updateBackground(speedFrame: number) {
    this.setSky();
    this.clouds.update(speedFrame);
  }
  updateForeground(speedFrame: number) {
    this.setDirt();
    this.setGrass();
    this.dirts.update(speedFrame);
    this.grass.update(speedFrame);
  }
  private setSky() {
    this.canvas.ctx.fillStyle = this.colors.sky;
    this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  private setDirt() {
    this.canvas.ctx.fillStyle = this.colors.dirt;
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
  reset() {
    this.clouds.reset();
    this.dirts.reset();
  }
}
