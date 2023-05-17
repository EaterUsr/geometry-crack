declare type canvasConfig = Readonly<{
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  w: (size: number) => number;
}>;

declare type graphicsConfig = Readonly<{
  speed: number;
  blockSize: number;
  cubeOrigin: coords;
  floorHeight: number;
  grassHeight: number;
  timePerBlock: number;
}>;

declare type blockConfig = Readonly<{
  getHitbox: (block: Block | Cube) => hitbox;
  color: color;
}>;

declare type Config = import("ts-essentials").DeepReadonly<{
  graphics: {
    width: number;
    height: number;
    speed: number;
    blockSize: number;
    grassHeight: number;
    floorHeight: number;
    colors: {
      sky: color;
      dirt: color;
      grass: color;
    };
  };
  components: {
    cube: blockConfig & {
      speedDeg: number;
      jumpSpeed: number;
      gravity: number;
      jumpVelocity: number;
    };
    spike: blockConfig;
    slab: blockConfig;
  };
  decorations: {
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
      color: color;
      sizeY: minmax;
      y: minmax;
      originalSize: number;
    };
  };
}>;
