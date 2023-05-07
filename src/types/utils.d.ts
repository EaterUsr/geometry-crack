type minmax = { min: number; max: number };

declare type coords = [x: number, y: number];
declare type hitbox = coords[];

declare type targetPosition<T extends number[] | number> = {
  content: T;
  target: T extends number[] ? nullable<T> : null | T;
  speed: number;
};

declare type HTMLSelector = string;

declare type color = `#${string}`;
declare type colorScheme = {
  readonly [index: string]: color;
};

type nullable<T> = {
  [P in keyof T]: T[P] | null;
};

declare type areNull<T extends null | unknown | (null | unknown)> = T extends unknown[] ? boolean[] : boolean;

declare type blockType = "Spike" | "Slab";
