export function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}
