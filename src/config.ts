import { squareHitbox, triangleHitbox, rectHitbox } from "@utils/collision";
import { Cube } from "@components/cube";
import { Spike } from "@components/block/spike";
import { Slab } from "@components/block/slab";

export const config: Config = {
  delayBeforeRestart: 150,
  structures: [
    [["spike", [0, 0]]],
    [
      ["spike", [0, 0]],
      ["spike", [4, 0]],
      ["spike", [5, 0]],
    ],
    [
      ["slab", [0, 0]],
      ["spike", [1, 0]],
      ["spike", [2, 0]],
      ["spike", [3, 0]],
    ],
  ],
  components: {
    cube: {
      urls: [
        "img/components/cube/death.svg",
        "img/components/cube/1_jump.svg",
        "img/components/cube/half_energy.svg",
        "img/components/cube/3_jumps.svg",
        "img/components/cube/full_energy.svg",
      ],
      jumps: 4,
      timeToRegen: 1300,
      speedDeg: 0.5,
      jumpSpeed: 0.5,
      gravity: 5,
      jumpVelocity: 170,
      getHitbox(cube: Cube) {
        return squareHitbox(cube.origin.content[0], cube.origin.content[1], 360 - cube.deg.content, cube.size);
      },
    },
    spike: {
      url: "img/components/spike.svg",
      getHitbox(spike: Spike) {
        return triangleHitbox(...spike.position, spike.size);
      },
    },
    slab: {
      url: "img/components/slab.svg",
      getHitbox(slab: Slab) {
        return rectHitbox(...slab.position, slab.size, slab.size / 2);
      },
    },
  },
  decorations: {
    dirts: {
      speed: 1,
      urls: ["img/components/dirt/depth-1.svg", "img/components/dirt/depth-2.svg", "img/components/dirt/depth-3.svg"],
      depths: [5, 10, 15],
      margins: [0, 1, 0],
      scale: 6,
    },
    clouds: {
      url: "img/components/cloud.svg",
      frequency: 0.3,
      depth: 4,
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
    speed: 1750,
    blockSize: 9,
    grassHeight: 20,
    floorHeight: 0.5,
  },
  canvasWidth: 800,
  canvasHeight: 365,
};
