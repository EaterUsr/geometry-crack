import { BackgroundDecoration } from "@components/backgroundDecoration";
import { trunc } from "@utils/decorators";
import { List } from "@utils/list";

export abstract class BackgroundDecorationsController<T extends BackgroundDecoration> {
  private readonly globalSpeed: number;
  abstract readonly frequency: number;
  abstract readonly depth: number;
  @trunc()
  distanceBetweenDecorations = 0;
  private content = new List<T>();
  private count = 0;
  speed = 0;

  constructor(private readonly canvas: CanvasConfig, { speed }: DecorationsConfig) {
    this.globalSpeed = speed;
    this.content = new List<T>();
    setTimeout(() => {
      this.calcSpeed();
      this.calcDistanceBetweenDecorations();
      this.calcCount();
      this.instanceEach();
    }, 0);
  }

  private calcSpeed() {
    this.speed = this.globalSpeed / this.depth;
  }
  private calcCount() {
    this.count = 1 + 1 / this.frequency;
  }

  private calcDistanceBetweenDecorations() {
    this.distanceBetweenDecorations = this.canvas.width * this.frequency;
  }

  private instanceEach() {
    for (let i = 0; i < this.count; i++) {
      this.content.append(this.instance());
    }
    this.content.forEach((decoration, index) => {
      decoration.position = this.distanceBetweenDecorations * (this.count - index);
    });
  }

  protected abstract instanceDecoration(canvas: CanvasConfig, speed: number): T;

  private instance(): T {
    return this.instanceDecoration(this.canvas, this.speed);
  }

  update(speedFrame: number) {
    this.content.forEach(decoration => {
      decoration.update(speedFrame);
    });
    if ((this.content.getLast()?.value.position as number) > this.distanceBetweenDecorations) {
      this.content.removeFirst();
      this.content.append(this.instance());
    }
  }
  reset() {
    this.content.clear();
    this.instanceEach();
  }
}
