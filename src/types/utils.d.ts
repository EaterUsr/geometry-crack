type Minmax = { min: number; max: number };

declare type Coords = [x: number, y: number];
declare type Hitbox = Coords[];

declare type TargetPosition<TPosition extends number[] | number> = {
  content: TPosition;
  target: TPosition extends number[] ? Nullable<TPosition> : null | TPosition;
  speed: TPosition extends number[] ? number[] : number;
};

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

type Elements =
  | "#game"
  | "#gameOver"
  | "#new-record"
  | "#score"
  | "#game-over__click-overlay"
  | "#paused"
  | "#menu"
  | "#play"
  | "#shop"
  | "#levels"
  | "#completed"
  | "#play__click-overlay"
  | "#jumps-left"
  | "#highest-score"
  | "#popup-title"
  | "#btn-yes"
  | "#btn-no"
  | "#reset-progress"
  | "#play__progress-bar"
  | "#play__crackcoin-counter"
  | "#play__crackcoin-counter-container"
  | "#shop__current-skin"
  | "#shop__skins"
  | "#levels-container"
  | "#challenge-btn"
  | "[data-button]"
  | "[data-crackcoins-counter]";

declare type Selector = Elements | `${Elements} ${Elements}`;

declare type SkinName = "default" | "batman" | "fractal" | "gameboy" | "matrix" | "neon" | "twinky";
declare type Skin = {
  imgs: string[];
  price: number;
  name: SkinName;
  status: "owned" | "equipped" | "unbought";
};

declare type LevelName = "1" | "2";
declare type Level = { content: StrucurePatern[]; reward: number };
