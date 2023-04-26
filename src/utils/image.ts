export function loadImage(src: string) {
  const img = new Image();
  img.src = src;
  return img;
}
