import { skinUrl } from "@/utils/image";

export const skins = [
  {
    name: "default",
    price: 0,
    status: "equipped",
  },
  {
    name: "batman",
    price: 50,
    status: "unbought",
  },
  {
    name: "fractal",
    price: 50,
    status: "unbought",
  },
  {
    name: "gameboy",
    price: 50,
    status: "unbought",
  },
  {
    name: "matrix",
    price: 50,
    status: "unbought",
  },
  {
    name: "neon",
    price: 50,
    status: "unbought",
  },
  {
    name: "twinky",
    price: 10,
    status: "unbought",
  },
]
  .map(skin => {
    const imgs = [];
    for (let i = 0; i <= 4; i++) {
      imgs[i] = skinUrl(skin.name as SkinName, i);
    }
    return {
      ...skin,
      imgs,
    };
  })
  .sort((a, b) => a.price - b.price) as Skin[];
