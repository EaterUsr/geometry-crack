import { CanvasController } from "@controllers/canvas";

const canvas = new CanvasController("#game");
canvas.start();

document.addEventListener("keyup", e => {
  const { key } = e;
  if (key === " " || key === "ArrowUp") canvas.jump();
});
document.addEventListener("click", () => canvas.jump());
