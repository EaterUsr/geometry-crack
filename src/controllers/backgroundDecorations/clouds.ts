import { BackgroundDecorationsController } from "@controllers/backgroundDecorations";
import { Cloud } from "@components/backgroundDecoration/cloud";
import { config } from "@config";

const cloudsConf = config.decorations.clouds;

export class CloudsController extends BackgroundDecorationsController<Cloud> {
  readonly frequency = cloudsConf.frequency;
  readonly depth = cloudsConf.depth;

  instanceDecoration(canvas: CanvasConfig, speed: number) {
    return new Cloud(canvas, speed);
  }
}
