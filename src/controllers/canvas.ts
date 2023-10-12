import { DecorationsController } from "@controllers/decorations";
import { Cube } from "@components/cube";
import { BlocksController } from "@controllers/blocks";
import { truncNbr } from "@utils/math";
import { config } from "@config";
import { UI, UIEvent } from "@controllers/ui";
import { Block } from "@components/block";
import { LocalStorage } from "./localStorage";

const cube = config.components.cube;

export class CanvasController {
  readonly config: CanvasConfig;
  private isActive = false;
  private lastFrame = Date.now();
  private readonly blocks: BlocksController;
  readonly decorations: DecorationsController;
  readonly cube: Cube;
  private jumpsLeft = cube.jumps;
  private lastRegen = Date.now();
  readonly domElement: HTMLCanvasElement;

  constructor(canvasHTMLQuery: HTMLSelector, private readonly ui: UI, private readonly storage: LocalStorage) {
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
      score: 0,
    };

    this.decorations = new DecorationsController(this.config);
    this.cube = new Cube(this.config, this.decorations.config);
    this.blocks = new BlocksController(this.config, this.decorations.config, this.onCollision.bind(this));

    this.ui.onJump = this.jump.bind(this);
    this.ui.onEvent(this.event.bind(this));

    this.animate();
  }
  jump() {
    if (this.jumpsLeft !== 0) this.cube.jump(() => this.jumpsLeft--);
  }
  start() {
    this.lastFrame = Date.now();
    this.isActive = true;
  }

  onCollision(block: Block) {
    switch (block.type) {
      case "spike":
        this.die();
        break;
      case "slab":
        this.cube.onSlabCollision.bind(this.cube)(block.position, block.hitbox);
        break;
    }
  }
  die() {
    if (this.config.score > this.storage.content.HS) {
      this.ui.displayNewRecord();
      this.storage.save();
      this.storage.content.HS = Math.floor(this.config.score);
    }
    this.ui.displayScore(Math.floor(this.config.score));
    this.ui.die();
  }

  private animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    if (this.cube.origin.content[0] < 0 && this.isActive) setTimeout(this.die.bind(this), cube.timeToDie);

    if (this.jumpsLeft === cube.jumps) this.lastRegen = Date.now();
    if (Date.now() - this.lastRegen > config.components.cube.timeToRegen) {
      this.jumpsLeft++;
      this.lastRegen = Date.now();
    }

    this.ui.displayJumpsLeft.bind(this.ui)(this.jumpsLeft);
    this.ui.displayTimeToRegen.bind(this.ui)(
      this.jumpsLeft === cube.jumps ? 1 : truncNbr((Date.now() - this.lastRegen) / config.components.cube.timeToRegen)
    );
    this.ui.displayHighestScore.bind(this.ui)(Math.floor(Math.max(this.storage.content.HS, this.config.score)));

    const speedFrame = this.isActive ? Date.now() - this.lastFrame : 0;
    this.lastFrame = Date.now();

    this.config.score += (speedFrame * this.decorations.config.speed) / this.decorations.config.blockSize;

    this.decorations.updateBackground(speedFrame);
    this.cube.update(speedFrame, this.jumpsLeft);
    this.blocks.update(this.cube.origin.content, speedFrame, this.cube.hitbox);
    this.decorations.updateForeground(speedFrame);
  }
  private reset() {
    this.config.score = 0;
    this.decorations.reset();
    this.blocks.clear();
    this.cube.reset();
    this.jumpsLeft = cube.jumps;
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
