type Minmax = { min: number; max: number };

declare type Coords = [x: number, y: number];
declare type Hitbox = Coords[];

declare type TargetPosition<TPosition extends number[] | number> = {
  content: TPosition;
  target: TPosition extends number[] ? Nullable<TPosition> : null | TPosition;
  speed: number;
};

declare type HTMLSelector = string;

declare type Color = `#${string}`;
declare type ColorScheme = {
  readonly [index: string]: Color;
};

type Nullable<TArray> = {
  [Key in keyof TArray]: TArray[Key] | null;
};

declare type AreNull<TValue extends null | unknown | (null | unknown)[]> = TValue extends unknown[]
  ? boolean[]
  : boolean;

declare type BlockType = "spike" | "slab";
declare type StructurePatern = [BlockType, Cooords];
declare type Structure = [score: Minmax, structure: StructurePatern[], jumps: number];
declare type Structures = Structure[];

declare type SkinName = "default" | "batman" | "fractal" | "gameboy" | "matrix" | "neon" | "twinky";
declare type Skin = {
  imgs: HTMLImageElement[];
  price: number;
  name: SkinName;
  status: "owned" | "equipped" | "unbought";
};
declare type Skins = Skin[];
