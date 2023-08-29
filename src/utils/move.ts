import { truncNbr } from "./math";

export function forward(originalPosition: number, speed: number, speedFrame: number) {
  return truncNbr(originalPosition + speed * speedFrame);
}

export function backward(originalPosition: number, speed: number, speedFrame: number) {
  return truncNbr(originalPosition - speed * speedFrame);
}
