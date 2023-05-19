import { toRadians, sqrt } from "@utils/math";

export function squareHitbox(x: number, y: number, deg: number, size: number): Hitbox {
  const vertices: Hitbox = [...new Array(4)];
  const center: Coords = [x + size / 2, y + size / 2];

  for (let i in vertices) {
    const pointX = Math.sin(toRadians(deg + Number(i) * 90 - 45)) * sqrt((size / 2) ** 2 * 2) + center[0];
    const pointY = Math.cos(toRadians(deg + Number(i) * 90 - 45)) * sqrt((size / 2) ** 2 * 2) + center[1];
    vertices[i] = [pointX, pointY];
  }

  return vertices;
}
export function rectHitbox(x: number, y: number, sizeX: number, sizeY: number): Hitbox {
  const vertices: Hitbox = [...new Array(4)];
  const center: Coords = [x + sizeX / 2, y + sizeY / 2];

  for (let i in vertices) {
    const pointX = Math.sin(toRadians(Number(i) * 90 - 45)) * sqrt((sizeX / 2) ** 2 * 2) + center[0];
    const pointY = Math.cos(toRadians(Number(i) * 90 - 45)) * sqrt((sizeY / 2) ** 2 * 2) + center[1];
    vertices[i] = [pointX, pointY];
  }

  return vertices;
}
export function triangleHitbox(x: number, y: number, size: number): Hitbox {
  return [
    [x, y + size],
    [x + size / 2, y],
    [x + size, y + size],
  ];
}

export function getCoordSlab(x: number, y: number, size: number): Hitbox {
  return [
    [x, y],
    [x + size, y],
    [x + size, y + size / 2],
    [x, y + size / 2],
  ];
}

function lineLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): boolean {
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }
  return false;
}

export function isCollision(verticesP: Hitbox, verticesT: Hitbox): boolean {
  for (let current = 0; current < verticesP.length; current++) {
    let next = Number(current) + 1;
    if (next === verticesP.length) next = 0;
    const vc = verticesP[current];
    const vn = verticesP[next];

    const collision = PolygonLine(vc[0], vc[1], vn[0], vn[1], verticesT);

    if (collision) return collision;
  }

  return false;
}

function PolygonLine(x1: number, y1: number, x2: number, y2: number, vertices: Hitbox): boolean {
  for (let current = 0; current < vertices.length; current++) {
    let next = Number(current) + 1;
    if (next === vertices.length) next = 0;
    const vc = vertices[current];
    const vn = vertices[next];

    const collision = lineLine(vc[0], vc[1], vn[0], vn[1], x1, y1, x2, y2);

    if (collision) return collision;
  }

  return false;
}
