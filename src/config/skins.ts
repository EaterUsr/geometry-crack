import { skinUrl } from "@/utils/image";

export const skins = [
  {
    name: "default",
    price: 0,
    status: "equipped",
  },
  {
    name: "twinky",
    price: 20,
    status: "unbought",
  },
  {
    name: "batman",
    price: 50,
    status: "unbought",
  },
  {
    name: "gameboy",
    price: 100,
    status: "unbought",
  },
  {
    name: "neon",
    price: 120,
    status: "unbought",
  },
  {
    name: "fractal",
    price: 150,
    status: "unbought",
  },
  {
    name: "matrix",
    price: 250,
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
