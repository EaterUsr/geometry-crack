import { DecorationsController } from "@/decorations";
import { Cube } from "@/components/cube";
import { BlocksController } from "@/components/blocks/controller";
import { truncNbr } from "@/utils/math";
import { config } from "@/config";
import { UI, UIEvent } from "@/ui";
import { Block } from "@/components/blocks/block";
import { Store } from "@/utils/store";
import { qs } from "@/utils/dom";
import { levels } from "@/config/levels";
import { CanvasConfig, LevelStorage } from "@/types/config";
import { getGamemode } from "./utils/gamemode";
import { Layers } from "./utils/layers";
import { ParticulesController } from "./decorations/particules";

const particulesConf = config.decorations.particules.grass;
const cubeConf = config.components.cube;
const collisionBlocksDebug: Record<string, BlockType[]> = {
  all: ["slab", "rock", "spike", "flag"],
  "rock+slab": ["rock", "slab", "flag"],
  spike: ["spike", "flag"],
  none: ["flag"],
};

export class CanvasController {
  private readonly blocks: BlocksController;
  private readonly particules: ParticulesController;
  private jumpsLeft = cubeConf.jumps;
  private lastRegen = Date.now();
  private isActive = false;
  private lastFrame = Date.now();
  private scoreMultiplier = 1;
  private fps = 0;
  private startDate = Date.now();
  private layers: Layers;
  readonly decorations: DecorationsController;
  readonly cube: Cube;
  readonly domElement: HTMLCanvasElement;
  readonly config: CanvasConfig;

  constructor(canvasHTMLQuery: Selector, private readonly ui: UI) {
    this.domElement = qs<HTMLCanvasElement>(canvasHTMLQuery);

    this.domElement.width = config.canvasWidth;
    this.domElement.height = config.canvasHeight;

    this.config = {
      width: this.domElement.width,
      height: this.domElement.height,
      score: 0,
    };

    const w = (size: number) => {
      return truncNbr(size * (this.domElement.width / 10000));
    };

    this.layers = new Layers(this.domElement.getContext("2d")!, w);
    this.decorations = new DecorationsController(this.config, this.layers);
    this.blocks = new BlocksController(this.config, this.decorations.config, this.onCollision, this.ui.level);
    this.cube = new Cube(this.config, this.decorations.config, w);
    this.particules = new ParticulesController(particulesConf, this.cube, this.decorations.config);

    this.layers.use(this.cube);
    this.layers.use(this.blocks);
    this.layers.use(this.particules);

    this.ui.onJump = this.jump.bind(this);
    this.ui.onEvent(this.event.bind(this));
    this.ui.displayCrackcoins(Store.content.crackcoins);
    this.ui.onSkinUpdate = this.cube.setSkin;

    setInterval(() => {
      this.ui.displayFPS(Math.floor((this.fps * 1000) / config.fpsCalculationTime));
      this.fps = 0;
    }, config.fpsCalculationTime);
    this.animate();

    if (getGamemode() === "default") return;

    window.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") this.lastFrame = Date.now() - 5000;
    });
  }

  jump() {
    if (this.jumpsLeft !== 0) this.cube.jump(() => this.jumpsLeft--);
  }

  start() {
    this.lastFrame = Date.now();
    this.isActive = true;
    this.startDate = Date.now();
    this.blocks.build(this.ui.level);
  }

  finish() {
    if (this.ui.level !== 0 && !(Store.content.levels[this.ui.level] as LevelStorage).completed) {
      Store.content.crackcoins += levels[this.ui.level].reward;
      (Store.content.levels[this.ui.level] as LevelStorage).completed = true;
      Store.content.levels[this.ui.level].HS = this.config.score;
      Store.save();
      this.ui.displayCrackcoins(Store.content.crackcoins);
    }
    this.ui.finish();
  }

  private collisionDebug(block: Block) {
    if (collisionBlocksDebug[this.ui.getCollisionSelect()].includes(block.type)) {
      this.collisionAction(block);
    }
  }

  private collisionAction(block: Block) {
    switch (block.type) {
      case "spike":
        this.die();
        break;
      case "slab":
        this.cube.onCollision(block.position, block.type);
        break;
      case "rock":
        this.cube.onCollision(block.position, block.type);
        break;
      case "flag":
        this.finish();
        break;
    }
  }

  onCollision = getGamemode() === "debug" ? this.collisionDebug.bind(this) : this.collisionAction.bind(this);

  die() {
    if (!this.isActive) return;
    this.ui.die();

    if (this.ui.level === 0) {
      Store.content.crackcoins += Math.floor(this.config.score / config.crackcoins.scoreDivider) * this.scoreMultiplier;

      if (this.scoreMultiplier !== 1) {
        this.ui.displayNewRecord();
        Store.content.levels[0].HS = Math.floor(this.config.score);
      }
    } else {
      if (Store.content.levels[this.ui.level].HS < this.config.score) {
        this.ui.displayNewRecord();
        Store.content.levels[this.ui.level].HS = Math.floor(this.config.score);
      }
    }

    Store.save();
    this.ui.displayScore(this.config.score);
    this.ui.displayCrackcoins(Store.content.crackcoins);
  }

  private animate = () => {
    window.requestAnimationFrame(this.animate);
    this.fps++;

    if (this.cube.origin.content[0] < 0 && this.isActive) setTimeout(this.die.bind(this), cubeConf.timeToDie);

    if (this.jumpsLeft === cubeConf.jumps) this.lastRegen = Date.now();

    if (Date.now() - this.lastRegen > config.components.cube.timeToRegen && this.isActive) {
      this.jumpsLeft++;
      this.lastRegen = Date.now();
    }

    this.ui.displayJumpsLeft(this.jumpsLeft);
    this.ui.displayTimeToRegen(
      this.jumpsLeft === cubeConf.jumps
        ? 1
        : truncNbr((Date.now() - this.lastRegen) / config.components.cube.timeToRegen)
    );

    const speedFrame = this.isActive ? Date.now() - this.lastFrame : 0;
    this.lastFrame = Date.now();

    this.config.score = truncNbr(
      ((Date.now() - this.startDate) * this.decorations.config.speed) / this.decorations.config.blockSize
    );

    this.decorations.update(speedFrame);
    this.cube.update(speedFrame, this.jumpsLeft);
    this.blocks.update(speedFrame, this.cube.origin.content, this.cube.hitbox);

    if (this.isActive) this.particules.update(speedFrame);

    this.layers.draw();

    if (this.ui.level === 0) {
      if (this.config.score > Store.content.levels[0].HS) this.scoreMultiplier = config.crackcoins.HSMultiplier;

      this.ui.displayProgressBar((this.config.score % config.crackcoins.scoreDivider) / config.crackcoins.scoreDivider);
      this.ui.displayCrackcoinsPlaying(
        Math.floor(this.config.score / config.crackcoins.scoreDivider) * this.scoreMultiplier
      );

      this.ui.displayHighestScore(Math.max(Store.content.levels[0].HS, this.config.score));

      return;
    }

    this.ui.displayProgressBar(1 - (this.blocks.flagDistance as number) / (this.blocks.levelSize as number));
    this.ui.displayHighestScore(Math.max(Store.content.levels[this.ui.level].HS, this.config.score));
  };

  private reset() {
    this.scoreMultiplier = 1;
    this.config.score = 0;
    this.cube.reset();
    this.decorations.reset();
    this.blocks.reset();
    this.particules.reset();
    this.jumpsLeft = cubeConf.jumps;
    this.startDate = Date.now();

    if (this.ui.level === 0) {
      this.ui.addCrackcoinsPlaying();
      return;
    }
    this.ui.removeCrackcoinsPlaying();
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
        this.ui.displayShop();
      case "FINISH":
        this.isActive = false;
        this.ui.displayShop();
    }
  }
}
