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
  color: Color;
}>;

declare type Config = import("ts-essentials").DeepReadonly<{
  canvasWidth: number;
  canvasHeight: number;
  structures: structurePatern[][];
  components: {
    cube: BlockConfig & {
      speedDeg: number;
      jumpSpeed: number;
      gravity: number;
      jumpVelocity: number;
      jumps: number;
      timeToRegen: number;
    };
    spike: BlockConfig;
    slab: BlockConfig;
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
    clouds: {
      depth: number;
      frequency: number;
      color: Color;
      sizeY: Minmax;
      y: Minmax;
      originalSize: number;
    };
  };
}>;
