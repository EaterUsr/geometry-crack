import { BackgroundDecorationsController } from "@controllers/backgroundDecorations";
import { Cloud } from "@components/backgroundDecorations/cloud";

export class CloudsController extends BackgroundDecorationsController<Cloud> {
  readonly frequency = 0.3;
  readonly depth = 4;

  instanceDecoration(canvas: canvasConfig, speed: number) {
    return new Cloud(canvas, speed);
  }
}
