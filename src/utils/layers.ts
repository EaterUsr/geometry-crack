import { config } from "@/config";

export type DrawOptions = Readonly<{ ctx: CanvasRenderingContext2D; w: (size: number) => number }>;
export type DrawFunc = (options: DrawOptions) => void;
export type LayerClass = { layerCategory: LayerCategory; draw: DrawFunc };

export class Layers {
  private readonly content = config.layers.reduce((acc, curr) => {
    acc[curr] = [];
    return acc;
  }, {} as Record<LayerCategory, DrawFunc[]>);
  private readonly drawOptions: DrawOptions;

  constructor(ctx: CanvasRenderingContext2D, w: (size: number) => number) {
    this.drawOptions = Object.freeze({ ctx, w });
  }

  add(category: LayerCategory, drawFunc: DrawFunc) {
    this.content[category].push(drawFunc);
  }

  use(layerClass: LayerClass) {
    this.add(layerClass.layerCategory, layerClass.draw.bind(layerClass));
  }

  draw() {
    config.layers.forEach(layerName => {
      this.content[layerName].forEach(drawFunc => {
        drawFunc(this.drawOptions);
      });
    });
  }
}
