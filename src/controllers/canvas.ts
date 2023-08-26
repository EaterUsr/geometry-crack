import { DecorationsController } from "@controllers/decorations";
import { Cube } from "@components/cube";
import { BlocksController } from "@controllers/blocks";
import { truncNbr } from "@utils/math";
import { config } from "@config";
import { UIEvent } from "@controllers/ui";

const cubeJumps = config.components.cube.jumps;

export class CanvasController {
  readonly config: CanvasConfig;
  private isActive = false;
  private lastFrame = Date.now();
  private readonly blocks: BlocksController;
  readonly decorations: DecorationsController;
  readonly cube: Cube;
  private jumpsLeft = cubeJumps;
  private lastRegen = Date.now();
  readonly domElement: HTMLCanvasElement;

  constructor(
    canvasHTMLQuery: HTMLSelector,
    private readonly onDie: () => void,
    private readonly displayJumpsLeft: (jumpsLeft: number) => void
  ) {
    const canvas = document.querySelector<HTMLCanvasElement>(canvasHTMLQuery);
    if (!canvas) throw new Error(`Invalid input: The query ${canvasHTMLQuery} does not match any HTML element`);
    this.domElement = canvas;

    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;

    this.config = {
      ctx: canvas.getContext("2d")!,
      width: canvas.width,
      height: canvas.height,
      w(size: number) {
        return truncNbr(size * (canvas.width / 10000));
      },
    };

    this.decorations = new DecorationsController(this.config);
    this.cube = new Cube(this.config, this.decorations.config);
    this.blocks = new BlocksController(
      this.config,
      this.decorations.config,
      this.cube.onSlabCollision.bind(this.cube),
      this.onCollision.bind(this)
    );

    this.animate();
  }
  jump() {
    this.startJump();
    this.removeJump();
  }
  startJump() {
    if (this.jumpsLeft !== 0) this.cube.jump();
  }
  removeJump() {
    if (this.jumpsLeft !== 0) this.jumpsLeft--;
  }
  start() {
    this.lastFrame = Date.now();
    this.isActive = true;
  }

  onCollision(type: BlockType) {
    if (type === "spike") {
      this.onDie();
    }
  }

  private animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    if (this.jumpsLeft === cubeJumps) this.lastRegen = Date.now();
    if (Date.now() - this.lastRegen > config.components.cube.timeToRegen) {
      this.jumpsLeft++;
      this.lastRegen = Date.now();
    }

    this.displayJumpsLeft(this.jumpsLeft);

    const speedFrame = this.isActive ? Date.now() - this.lastFrame : 0;
    this.lastFrame = Date.now();

    this.decorations.updateBackground(speedFrame);
    this.blocks.update(this.cube.origin.content, speedFrame, this.cube.hitbox);
    this.cube.update(speedFrame, this.jumpsLeft);
    this.decorations.updateForeground(speedFrame);
  }
  private reset() {
    this.decorations.reset();
    this.blocks.clear();
    this.cube.reset();
    this.jumpsLeft = cubeJumps;
  }
  event(event: UIEvent) {
    switch (event.type) {
      case "START":
        this.reset();
        this.start();
        break;
      case "PAUSE":
        this.isActive = false;
        break;
      case "RESUME":
        this.start();
        break;
      case "RESTART":
        this.reset();
        this.start();
        break;
      case "DIE":
        this.isActive = false;
        break;
      case "BACK":
        this.reset();
        break;
    }
  }
}
