export function calcCarousel(imageWidth: number, canvasWidth: number) {
  if (!imageWidth) return [];
  const count = Math.floor(canvasWidth / imageWidth) + 4;
  const components: number[] = [...new Array(count)];

  return components.map((_, index) => (index - 1) * imageWidth - index);
}
