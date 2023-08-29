declare type CanvasConfig = Readonly<{
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  w: (size: number) => number;
}>;

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
  url: string;
}>;

declare type Config = import("ts-essentials").DeepReadonly<{
  canvasWidth: number;
  canvasHeight: number;
  structures: Structures;
  delayBeforeRestart: number;
  components: {
    cube: {
      timeToDie: number;
      urls: string[];
      getHitbox: (block: Block | Cube) => Hitbox;
      speedDeg: number;
      jumpSpeed: number;
      jumpVelocity: number;
      jumps: number;
      timeToRegen: number;
    };
    spike: BlockConfig;
    slab: blockconfig;
  };
  decorations: {
    speed: number;
    blockSize: number;
    grassHeight: number;
    floorHeight: number;
    colors: {
      sky: Color;
      dirt: Color;
      grass: Color;
    };
    dirts: {
      speed: number;
      urls: string[];
      depths: number[];
      margins: number[];
      scale: number;
    };
    grass: {
      scale: number;
      url: string;
      speed: number;
    };
    clouds: {
      depth: number;
      frequency: number;
      url: string;
      sizeY: Minmax;
      y: Minmax;
      originalSize: number;
    };
  };
}>;
