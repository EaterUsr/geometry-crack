declare type HTMLSelector = string;

declare type canvasConfig = Readonly<{
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}>;

declare type graphicsConfig = Readonly<{
  speed: number;
  blockSize: number;
  cubeOrigin: coords;
  floorHeight: number;
  grassHeight: number;
  timePerBlock: number;
}>;

declare type color = `#${string}`;
declare type colorScheme = {
  readonly [index: string]: color;
};

declare type coords = [x: number, y: number];
declare type hitbox = coords[];

type nullable<T> = {
  [P in keyof T]: T[P] | null;
};

declare type targetPosition<T extends number[] | number> = {
  content: T;
  target: T extends number[] ? nullable<T> : null | T;
  speed: number;
};

declare type areNull<T extends null | unknown | (null | unknown)> = T extends unknown[] ? boolean[] : boolean;

declare type blockType = "Spike" | "Slab";
