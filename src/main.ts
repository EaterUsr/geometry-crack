import "./style.css";
import { CanvasController } from "@controllers/canvas";
import { UI } from "@controllers/ui";

const ui = new UI();

const canvas = new CanvasController("#game", ui.die.bind(ui), ui.displayJumpsLeft.bind(ui));
ui.onEvent(event => canvas.event(event));

document.addEventListener("keydown", e => {
  const { key } = e;
  if (key === " " || key === "ArrowUp") canvas.jump();
});
document.addEventListener("click", () => canvas.jump());
