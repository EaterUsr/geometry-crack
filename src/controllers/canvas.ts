import { GraphicsController } from "@controllers/graphics";
import { Cube } from "@components/cube";
import { BlocksController } from "@controllers/blocks";
import { truncNbr } from "@utils/math";
import { config } from "@config";
export class CanvasController {
  readonly config: canvasConfig;
  private isActive = false;
  private lastFrame = Date.now();
  private blocks: BlocksController;
  readonly graphics: GraphicsController;
  readonly cube: Cube;

  constructor(canvasHTMLQuery: HTMLSelector) {
    const canvas = document.querySelector<HTMLCanvasElement>(canvasHTMLQuery);
    if (!canvas) throw new Error(`Invalid input: The query ${canvasHTMLQuery} does not match any HTML element`);

    canvas.width = config.graphics.width;
    canvas.height = config.graphics.height;

    this.config = {
      ctx: canvas.getContext("2d")!,
      width: canvas.width,
      height: canvas.height,
      w(size: number) {
        return truncNbr(size * (this.width / 10000));
      },
    };
    this.graphics = new GraphicsController(this.config);
    this.cube = new Cube(this.config, this.graphics.config);
    this.blocks = new BlocksController(
      this.cube.size,
      this.config,
      this.graphics.config,
      this.cube.onSlabCollision.bind(this.cube)
    );
  }
  jump() {
    this.cube.jump();
  }
  start() {
    this.isActive = true;
    this.animate();
  }
  addBlock(block: blockType) {
    this.blocks.add(block);
  }

  private animate() {
    if (this.isActive) window.requestAnimationFrame(this.animate.bind(this));

    const speedFrame = Date.now() - this.lastFrame;
    this.lastFrame = Date.now();

    this.graphics.updateBackground(speedFrame);
    this.blocks.update(this.cube.origin.content, speedFrame, this.cube.hitbox);
    this.cube.update(speedFrame);
    this.graphics.updateForeground(speedFrame);
  }
  stop() {
    this.isActive = false;
  }
}
