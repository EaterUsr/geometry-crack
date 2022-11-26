type polygon = [x: number, y: number][];

export function getCoordSquare(x: number, y: number, deg: number, size: number): polygon {
  const vertices: polygon = [...new Array(4)];

  let lastVert = [0, 0];
  let pointX = 0;
  let pointY = 0;

  for (let i in vertices) {
    pointX =
      i === "0"
        ? 0
        : Math.floor(Math.sin((deg / 360) * Math.PI * 2 + ((Number(i) - 1) * Math.PI) / 2) * size + lastVert[0]);
    pointY =
      i === "0"
        ? 0
        : Math.floor(Math.cos((deg / 360) * Math.PI * 2 + ((Number(i) - 1) * Math.PI) / 2) * size + lastVert[1]);
    lastVert = [pointX, pointY];
    vertices[i] = [pointX + x, pointY + y];
  }

  return vertices;
}
export function getCoordTriangle(x: number, y: number, size: number): polygon {
  return [
    [x, y + size],
    [x + size / 2, y],
    [x + size, y + size],
  ];
}

export function getCoordSlab(x: number, y: number, size: number): polygon {
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

export function isCollision(verticesP: polygon, verticesT: polygon): boolean {
  let next;
  let vc;
  let vn;
  let collision = false;

  for (let current = 0; current < verticesP.length; current++) {
    next = Number(current) + 1;
    if (next === verticesP.length) next = 0;
    vc = verticesP[current];
    vn = verticesP[next];

    collision = PolygonLine(vc[0], vc[1], vn[0], vn[1], verticesT);

    if (collision) return collision;
  }

  return false;
}

function PolygonLine(x1: number, y1: number, x2: number, y2: number, vertices: polygon): boolean {
  let next;
  let vc;
  let vn;
  let collision = false;

  for (let current = 0; current < vertices.length; current++) {
    next = Number(current) + 1;
    if (next === vertices.length) next = 0;
    vc = vertices[current];
    vn = vertices[next];

    collision = lineLine(vc[0], vc[1], vn[0], vn[1], x1, y1, x2, y2);

    if (collision) return collision;
  }

  return false;
}
