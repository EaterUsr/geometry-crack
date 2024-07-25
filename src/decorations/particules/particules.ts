import { Particule } from "./particule";
import { ViewItems } from "@/utils/viewItems";
import { randomMinMax } from "@/utils/math";
import { DecorationsConfig, ParticuleConfig } from "@/types/config";
import { DrawOptions } from "@/utils/layers";
import { Cube } from "@/components/cube";

export class ParticulesController {
  private readonly content = new ViewItems<Particule>();
  private readonly position: Coords;
  private lastParticule = Date.now();
  readonly layerCategory: LayerCategory = "particules";

  constructor(private readonly config: ParticuleConfig, private readonly cube: Cube, decorations: DecorationsConfig) {
    this.position = [decorations.cubeOrigin[0], this.cube.center[1] + decorations.blockSize];
    this.content.append(this.newParticule());
  }

  private newParticule() {
    return new Particule(
      [...this.position],
      this.config.img,
      randomMinMax(this.config.vx),
      randomMinMax(this.config.vy),
      randomMinMax(this.config.vdeg)
    );
  }

  update(speedFrame: number) {
    this.content.forEach((particule: Particule) => particule.update(speedFrame));

    if (Date.now() - this.lastParticule > this.config.delay && !this.cube.isJumping()) {
      this.lastParticule = Date.now();
      this.content.append(this.newParticule());
    }
  }

  draw({ ctx }: DrawOptions) {
    this.content.forEach(particule => particule.draw(ctx));
  }

  reset() {
    this.content.clear();
  }
}
