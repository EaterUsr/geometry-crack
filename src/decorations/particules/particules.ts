import { Particule } from "./particule";
import { List } from "@/utils/list";
import { randomMinMax } from "@/utils/math";

export class ParticulesController {
  private readonly content = new List<Particule>();
  isActive = true;
  private lastParticule = Date.now();

  constructor(
    private readonly canvas: CanvasConfig,
    private readonly position: Coords,
    private readonly config: ParticuleConfig
  ) {
    this.content.append(this.newParticule());
  }

  private newParticule() {
    return new Particule(
      [...this.position],
      this.config.img,
      randomMinMax(this.config.vx),
      randomMinMax(this.config.vy),
      randomMinMax(this.config.vdeg),
      () => this.content.removeFirst(),
      this.canvas
    );
  }

  update(speedFrame: number) {
    this.content.forEach(particule => particule.update(speedFrame));
    if (Date.now() - this.lastParticule > this.config.delay) {
      this.lastParticule = Date.now();
      if (this.isActive) this.content.append(this.newParticule());
    }
  }

  reset() {
    this.content.clear();
  }
}
