import "./style.css";
import "./fonts.ts";
import { CanvasController } from "./canvas";
import { UI } from "./ui";
import { LocalStorage } from "@/utils/localStorage";

const storage = new LocalStorage();
const ui = new UI();

new CanvasController("#game", ui, storage);
