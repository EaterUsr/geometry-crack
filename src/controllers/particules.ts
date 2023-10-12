import { Particule } from "@components/particule";
import { List } from "@utils/list";
import { randomMinMax } from "@utils/math";

export class ParticulesController {
  private readonly content = new List<Particule>();
  isActive = true;
  private lastParticule = Date.now();

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly position: Coords,
    private readonly delay: number,
    private readonly vx: Minmax,
    private readonly vy: Minmax,
    private readonly vdeg: Minmax,
    private readonly img: HTMLImageElement
  ) {
    this.content.append(this.newParticule());
  }

  private newParticule() {
    return new Particule(
      [...this.position],
      this.img,
      randomMinMax(this.vx),
      randomMinMax(this.vy),
      randomMinMax(this.vdeg),
      () => this.content.removeFirst(),
      this.canvas
    );
  }

  update(speedFrame: number) {
    this.content.forEach(particule => particule.update(speedFrame));
    if (Date.now() - this.lastParticule > this.delay) {
      this.lastParticule = Date.now();
      if (this.isActive) this.content.append(this.newParticule());
    }
  }

  reset() {
    this.content.clear();
  }
}
