import "./style.css";
import "./fonts.ts";
import { CanvasController } from "@controllers/canvas";
import { UI } from "@controllers/ui";
import { LocalStorage } from "@controllers/localStorage";

const storage = new LocalStorage();
const ui = new UI();

new CanvasController("#game", ui, storage);
