export function random(min: number, max: number, multiplier = 1) {
  min *= multiplier;
  max *= multiplier;
  return Math.random() * (max - min) + min;
}

export function randomMinMax(minmax: minmax, multiplier?: number) {
  return random(minmax.min, minmax.max, multiplier);
}

export function diff(nbr1: number, nbr2: number) {
  return Math.abs(nbr1 - nbr2);
}

const cornersDeg = [...new Array(5)].map((_, index) => index * 90);

export function closestDeg(deg: number) {
  const distances = [...new Array(5)].map((_, index) => diff(cornersDeg[index], deg));

  let smallestDistance = 361;
  let smallestDistanceIndex = 0;

  distances.forEach((deg, index) => {
    if (smallestDistance > deg) {
      smallestDistance = deg;
      smallestDistanceIndex = index;
    }
  });

  return cornersDeg[smallestDistanceIndex];
}

export function toDegrees(angle: number) {
  return (angle * Math.PI) / 180;
}

export function toRadians(angle: number) {
  return (angle / 180) * Math.PI;
}

export function smallest<T extends unknown[]>(cb: (...args: T) => number, ...args: T[]) {
  const nbrs = args.map(arg => cb(...arg));
  const absNbrs = nbrs.map(nbr => Math.abs(nbr));
  const minAbsNbr = Math.min(...absNbrs);
  let minNbr = 0;

  absNbrs.forEach((nbr, index) => {
    if (nbr === minAbsNbr) minNbr = nbrs[index];
  });

  return minNbr;
}
