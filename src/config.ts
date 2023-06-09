import { squareHitbox, triangleHitbox, rectHitbox } from "@utils/collision";
import { Cube } from "@components/cube";
import { Spike } from "@components/block/spike";
import { Slab } from "@components/block/slab";

export const config: Config = {
  components: {
    cube: {
      color: "#000",
      speedDeg: 0.5,
      jumpSpeed: 5,
      gravity: 6,
      jumpVelocity: 22,
      getHitbox(cube: Cube) {
        return squareHitbox(
          cube.origin.content[0],
          cube.origin.content[1] - cube.jumpHeight,
          360 - cube.deg.content,
          cube.size
        );
      },
    },
    spike: {
      color: "#f00",
      getHitbox(spike: Spike) {
        return triangleHitbox(...spike.position, spike.size);
      },
    },
    slab: {
      color: "#000",
      getHitbox(slab: Slab) {
        return rectHitbox(...slab.position, slab.size, slab.size / 2);
      },
    },
  },
  decorations: {
    dirts: {
      speed: 1,
      urls: ["img/dirt/depth-1.svg", "img/dirt/depth-2.svg", "img/dirt/depth-3.svg"],
      depths: [5, 10, 15],
      margins: [0, 1, 0],
      scale: 6,
    },
    clouds: {
      frequency: 0.3,
      depth: 4,
      color: "#fff",
      sizeY: {
        min: 1.1,
        max: 1.5,
      },
      y: {
        min: 0.3,
        max: 1.5,
      },
      originalSize: 110,
    },
    colors: {
      sky: "#00C2FF",
      dirt: "#A85100",
      grass: "#1CA600",
    },
    speed: 1460,
    blockSize: 9,
    grassHeight: 20,
    floorHeight: 0.5,
  },
  canvasWidth: 800,
  canvasHeight: 365,
};
