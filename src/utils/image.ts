export function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

export function skinUrl(skinName: SkinName, energy = 4) {
  return `/img/skins/${skinName}/${energy}.svg`;
}
