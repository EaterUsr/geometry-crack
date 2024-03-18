import { DecorationsController } from "@/decorations";
import { Cube } from "@/components/cube";
import { BlocksController } from "@/components/blocks/controller";
import { truncNbr } from "@/utils/math";
import { config } from "@/config";
import { UI, UIEvent } from "@/ui";
import { Block } from "@/components/blocks/block";
import { Store } from "@/utils/store";
import { qs } from "@/utils/dom";

const cubeConf = config.components.cube;

export class CanvasController {
  private readonly blocks: BlocksController;
  readonly decorations: DecorationsController;
  readonly cube: Cube;
  readonly domElement: HTMLCanvasElement;
  readonly config: CanvasConfig;
  private jumpsLeft = cubeConf.jumps;
  private lastRegen = Date.now();
  private isActive = false;
  private lastFrame = Date.now();
  private scoreMultiplier = 1;

  constructor(canvasHTMLQuery: Selector, private readonly ui: UI) {
    this.domElement = qs<HTMLCanvasElement>(canvasHTMLQuery);

    this.domElement.width = config.canvasWidth;
    this.domElement.height = config.canvasHeight;

    this.config = {
      ctx: this.domElement.getContext("2d")!,
      width: this.domElement.width,
      height: this.domElement.height,
      w: (size: number) => {
        return truncNbr(size * (this.domElement.width / 10000));
      },
      score: 0,
    };

    this.decorations = new DecorationsController(this.config);
    this.cube = new Cube(this.config, this.decorations.config);
    this.blocks = new BlocksController(this.config, this.decorations.config, this.onCollision);

    this.ui.onJump = this.jump.bind(this);
    this.ui.onEvent(this.event.bind(this));
    this.ui.displayCrackcoins(Store.content.crackcoins);
    this.ui.onSkinUpdate = this.cube.setSkin;

    this.cube.skin = "default";

    this.animate();
  }

  jump() {
    if (this.jumpsLeft !== 0) this.cube.jump(() => this.jumpsLeft--);
  }

  start() {
    this.lastFrame = Date.now();
    this.isActive = true;
  }

  onCollision = (block: Block) => {
    switch (block.type) {
      case "spike":
        this.die();
        break;
      case "slab":
        this.cube.onSlabCollision(block.position);
        break;
    }
  };

  die() {
    if (!this.isActive) return;

    Store.content.crackcoins += Math.floor(this.config.score / config.crackcoins.scoreDivider) * this.scoreMultiplier;

    if (this.scoreMultiplier !== 1) {
      this.ui.displayNewRecord();
      Store.content.HS = Math.floor(this.config.score);
    }

    Store.save();
    this.ui.displayScore(this.config.score);
    this.ui.displayCrackcoins(Store.content.crackcoins);
    this.ui.die();
    this.isActive = false;
  }

  private animate = () => {
    window.requestAnimationFrame(this.animate);

    if (this.cube.origin.content[0] < 0) setTimeout(this.die.bind(this), cubeConf.timeToDie);

    if (this.jumpsLeft === cubeConf.jumps) this.lastRegen = Date.now();

    if (Date.now() - this.lastRegen > config.components.cube.timeToRegen) {
      this.jumpsLeft++;
      this.lastRegen = Date.now();
    }

    if (this.config.score > Store.content.HS) this.scoreMultiplier = config.crackcoins.HSMultiplier;

    this.ui.displayJumpsLeft(this.jumpsLeft);
    this.ui.displayTimeToRegen(
      this.jumpsLeft === cubeConf.jumps
        ? 1
        : truncNbr((Date.now() - this.lastRegen) / config.components.cube.timeToRegen)
    );
    this.ui.displayHighestScore(Math.max(Store.content.HS, this.config.score));
    this.ui.displayProgressBar((this.config.score % config.crackcoins.scoreDivider) / config.crackcoins.scoreDivider);
    this.ui.displayCrackcoinsPlaying(
      Math.floor(this.config.score / config.crackcoins.scoreDivider) * this.scoreMultiplier
    );

    const speedFrame = this.isActive ? Date.now() - this.lastFrame : 0;
    this.lastFrame = Date.now();

    this.config.score = truncNbr(
      this.config.score + (speedFrame * this.decorations.config.speed) / this.decorations.config.blockSize
    );

    this.decorations.updateBackground(speedFrame);
    this.cube.update(speedFrame, this.jumpsLeft);
    this.blocks.update(this.cube.origin.content, speedFrame, this.cube.hitbox);
    this.decorations.updateForeground(speedFrame);
  };

  private reset() {
    this.scoreMultiplier = 1;
    this.config.score = 0;
    this.decorations.reset();
    this.blocks.reset();
    this.cube.reset();
    this.jumpsLeft = cubeConf.jumps;
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
      case "SHOP":
        this.ui.displayShop(this.cube.skin);
    }
  }
}
