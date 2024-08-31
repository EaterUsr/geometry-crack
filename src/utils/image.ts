export function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

export function skinNameToUrl(skinName: SkinName, energy = 4) {
  return `/img/skins/${skinName}/${energy}.svg`;
}

export function skinNameToUrls(skinName: SkinName) {
  const skinUrls = [...new Array(5)];

  return skinUrls.map((_, i) => `/img/skins/${skinName}/${i}.svg`);
}
