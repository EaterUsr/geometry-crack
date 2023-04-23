import { CanvasController } from "@controllers/canvas";

const canvas = new CanvasController("#game");

canvas.start();

document.addEventListener("keyup", e => {
  const { key } = e;
  if (key === " " || key === "ArrowUp") jump();
});
document.addEventListener("click", () => jump());

function jump() {
  canvas.jump();
}
