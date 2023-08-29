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
  return (Math.floor((45 + deg) / 90) * 90) % 360;
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
  const multiplier = Math.pow(10, decimals);
  const adjustedNum = nbr * multiplier;
  const truncatedNum = Math.floor(adjustedNum);

  return truncatedNum / multiplier;
}

const sqrtCache = new Map<number, number>();

export function sqrt(nbr: number): number {
  const keyNbr = truncNbr(nbr, 0);
  if (sqrtCache.has(keyNbr)) return sqrtCache.get(keyNbr) as number;

  const result = truncNbr(Math.sqrt(keyNbr));
  sqrtCache.set(keyNbr, result);

  return result;
}
