export function random(min: number, max: number, multiplier = 1) {
  min *= multiplier;
  max *= multiplier;
  return Math.random() * (max - min) + min;
}

export function randomMinMax(minmax: Minmax, multiplier?: number) {
  return random(minmax.min, minmax.max, multiplier);
}

export function diff(nbr1: number, nbr2: number) {
  return Math.abs(nbr1 - nbr2);
}

export function closestDeg(deg: number) {
  const difference = deg % 90;
  const rightAngle = deg / 90 - difference;

  if (difference > 45) return rightAngle + 90;

  return rightAngle;
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

export function truncNbr(nbr: number, decimals = 2) {
  const multiplier = 10 ** decimals;
  return Math.floor(nbr * multiplier) / multiplier;
}
