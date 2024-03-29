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
  img: HTMLImageElement;
}>;

type ParticuleName = "grass";

declare type ParticuleConfig = Readonly<{
  delay: number;
  vx: Minmax;
  vy: Minmax;
  vdeg: Minmax;
  img: HTMLImageElement;
}>;

declare type LocalStorage = {
  HS: number;
  crackcoins: number;
};

declare type Config = Readonly<{
  canvasWidth: number;
  canvasHeight: number;
  structures: Structures;
  delayBeforeRestart: number;
  components: Readonly<{
    cube: Readonly<{
      timeToDie: number;
      speedDeg: number;
      speedDegCollision: number;
      jumpSpeed: number;
      jumpVelocity: number;
      jumps: number;
      timeToRegen: number;
      positionX: number;
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
      img: HTMLImageElement;
      depth: number;
      scale: number;
    }>;
    particules: Record<ParticuleName, particuleConfig>;
  }>;
  crackcoins: {
    scoreDivider: number;
    HSMultiplier: number;
  };
  localStorage: Readonly<{
    default: LocalStorage;
    parser: (storage: LocalStorage) => LocalStorage;
  }>;
}>;
