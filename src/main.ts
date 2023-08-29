import "./style.css";
import { CanvasController } from "@controllers/canvas";
import { UI } from "@controllers/ui";

const ui = new UI();

const canvas = new CanvasController("#game", ui.die.bind(ui), ui.displayJumpsLeft.bind(ui));
ui.onEvent(event => canvas.event(event));
ui.onStartJump = canvas.startJump.bind(canvas);
ui.onRemoveJump = canvas.removeJump.bind(canvas);
