import { loadImage, skinUrl } from "@/utils/image";

export const skins: Skins = [
  {
    name: "default",
    price: 0,
    imgs: [],
    status: "equipped",
  },
  {
    name: "batman",
    price: 50,
    imgs: [],
    status: "unbought",
  },
  {
    name: "fractal",
    price: 50,
    imgs: [],
    status: "unbought",
  },
  {
    name: "gameboy",
    price: 50,
    imgs: [],
    status: "unbought",
  },
  {
    name: "matrix",
    price: 50,
    imgs: [],
    status: "unbought",
  },
  {
    name: "neon",
    price: 50,
    imgs: [],
    status: "unbought",
  },
  {
    name: "twinky",
    price: 10,
    imgs: [],
    status: "unbought",
  },
];

skins.forEach(({ name }, index) => {
  for (let i = 0; i <= 4; i++) {
    skins[index].imgs[i] = loadImage(skinUrl(name, i));
  }
});

skins.sort((a, b) => a.price - b.price);
