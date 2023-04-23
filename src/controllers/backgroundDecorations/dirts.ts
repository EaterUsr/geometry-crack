import { Dirt } from "@components/backgroundDecorations/dirt";
import { BackgroundDecorationsController } from "@controllers/backgroundDecorations";

export class DirtsController extends BackgroundDecorationsController<Dirt> {
  readonly frequency = 0.25;
  readonly depth = 1;

  instanceDecoration(canvas: canvasConfig, speed: number) {
    return new Dirt(canvas, speed);
  }
}
