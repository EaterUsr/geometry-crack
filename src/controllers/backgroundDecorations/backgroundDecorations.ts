import { BackgroundDecoration } from "@components/backgroundDecorations";
import { List } from "@utils/list";

export abstract class BackgroundDecorationsController<T extends BackgroundDecoration> {
  private readonly globalSpeed: number;
  abstract readonly frequency: number;
  abstract readonly depth: number;
  private timeBetweenDecorations = 0;
  private content = new List<T>();
  speed = 0;
  count = 0;

  constructor(private readonly canvas: canvasConfig, { speed }: graphicsConfig) {
    this.globalSpeed = speed;
    this.content = new List<T>();
    setTimeout(() => {
      this.calcSpeed();
      this.calcTimeBetweenDecorations();
      this.calcCount();
      this.instanceEach();

      setInterval(() => this.interval(), this.timeBetweenDecorations);
    }, 0);
  }

  private calcSpeed() {
    this.speed = this.globalSpeed / this.depth;
  }
  private calcCount() {
    this.count = 1 + 1 / this.frequency;
  }

  private calcTimeBetweenDecorations() {
    this.timeBetweenDecorations = (this.canvas.width * this.frequency) / this.speed;
  }

  private instanceEach() {
    for (let i = 0; i < this.count; i++) {
      this.content.append(this.instance());
    }
    this.content.forEach((decoration, index) => {
      decoration.update(this.timeBetweenDecorations * (this.count - index));
    });
  }
  private interval() {
    this.content.append(this.instance());
    this.content.removeFirst();
  }

  protected abstract instanceDecoration(canvas: canvasConfig, speed: number): T;

  private instance(): T {
    return this.instanceDecoration(this.canvas, this.speed);
  }

  update(speed: number) {
    this.content.forEach(decoration => {
      decoration.update(speed);
    });
  }
}
