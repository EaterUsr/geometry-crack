export function forward(originalPosition: number, speed: number, speedFrame: number): number {
  return originalPosition + speed * speedFrame;
}

export function backward(originalPosition: number, speed: number, speedFrame: number): number {
  return originalPosition - speed * speedFrame;
}
