declare type CanvasConfig = {
  readonly ctx: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
  readonly w: (size: number) => number;
  score: number;
};

declare type DecorationsConfig = Readonly<{
  speed: number;
  blockSize: number;
  cubeOrigin: Coords;
  floorHeight: number;
  grassHeight: number;
  timePerBlock: number;
}>;

declare type BlockConfig = Readonly<{
  getHitbox: (block: Block | Cube) => Hitbox;
  img: HTMLImageElement;
}>;

declare type Config = Readonly<{
  canvasWidth: number;
  canvasHeight: number;
  structures: Structures;
  delayBeforeRestart: number;
  components: Readonly<{
    cube: Readonly<{
      timeToDie: number;
      imgs: HTMLImageElement[];
      getHitbox: (block: Block | Cube) => Hitbox;
      speedDeg: number;
      jumpSpeed: number;
      jumpVelocity: number;
      jumps: number;
      timeToRegen: number;
    }>;
    spike: BlockConfig;
    slab: blockconfig;
  }>;
  decorations: Readonly<{
    speed: number;
    blockSize: number;
    grassHeight: number;
    floorHeight: number;
    colors: Readonly<{
      sky: Color;
      dirt: Color;
      grass: Color;
    }>;
    dirts: Readonly<{
      imgs: HTMLImageElement[];
      depths: number[];
      margins: number[];
      scale: number;
    }>;
    grass: Readonly<{
      scale: number;
      img: HTMLImageElement;
    }>;
    clouds: Readonly<{
      depth: number;
      frequency: number;
      img: HTMLImageElement;
      sizeY: Minmax;
      y: Minmax;
      originalSize: number;
    }>;
  }>;
}>;
