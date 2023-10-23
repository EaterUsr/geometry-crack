import "./style.css";
import "./fonts.ts";
import { CanvasController } from "./canvas";
import { UI } from "./ui";
import { StorageManager } from "@/utils/localStorage";

const storage = new StorageManager();
const ui = new UI();

new CanvasController("#game", ui, storage);
