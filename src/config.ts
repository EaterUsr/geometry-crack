import { squareHitbox, triangleHitbox, rectHitbox } from "@utils/collision";
import { Cube } from "@components/cube";
import { Spike } from "@components/block/spike";
import { Slab } from "@components/block/slab";
import { structures } from "./structures";
import { loadImage } from "@utils/image";

export const config: Config = {
  structures,
  delayBeforeRestart: 150,
  components: {
    cube: {
      timeToDie: 150,
      imgs: [
        "img/components/cube/death.svg",
        "img/components/cube/1_jump.svg",
        "img/components/cube/half_energy.svg",
        "img/components/cube/3_jumps.svg",
        "img/components/cube/full_energy.svg",
      ].map(loadImage),
      jumps: 4,
      timeToRegen: 1100,
      speedDeg: 0.5,
      jumpSpeed: 0.5,
      jumpVelocity: 175,
      getHitbox(cube: Cube) {
        return squareHitbox(cube.origin.content[0], cube.origin.content[1], 360 - cube.deg.content, cube.size);
      },
      positionX: 0.2,
    },
    spike: {
      img: loadImage("img/components/spike.svg"),
      getHitbox(spike: Spike) {
        return triangleHitbox(...spike.position, spike.size);
      },
    },
    slab: {
      img: loadImage("img/components/slab.svg"),
      getHitbox(slab: Slab) {
        return rectHitbox(...slab.position, slab.size, slab.size / 2);
      },
    },
  },
  decorations: {
    particules: {
      grass: {
        delay: 200,
        vx: { max: -1, min: -4 },
        vy: { min: -1, max: -0.5 },
        vdeg: { min: -1, max: 3 },
        img: loadImage("img/particules/grass.svg"),
      },
    },
    grass: {
      img: loadImage("img/components/grass.svg"),
      scale: 3,
    },
    dirts: {
      imgs: [
        "img/components/dirt/depth-1.svg",
        "img/components/dirt/depth-2.svg",
        "img/components/dirt/depth-3.svg",
      ].map(loadImage),
      depths: [4, 8, 13],
      margins: [0, 1, 0],
      scale: 6,
    },
    clouds: {
      img: loadImage("img/components/clouds.svg"),
      depth: 4,
      scale: 6,
    },
    colors: {
      sky: "#0386FF",
      dirt: "#A85100",
      grass: "#149000",
    },
    speed: 1900,
    blockSize: 9,
    grassHeight: 20,
    floorHeight: 0.65,
  },
  canvasWidth: 800,
  canvasHeight: 365,
};
