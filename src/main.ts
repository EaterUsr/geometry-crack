import "./style.css";
import { CanvasController } from "@controllers/canvas";
import { UI } from "@controllers/ui";

const ui = new UI();

new CanvasController("#game", ui);
