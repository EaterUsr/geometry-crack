import "./main.css";
import "./fonts.ts";
import { CanvasController } from "./canvas";
import { UI } from "./ui";
import { StorageManager } from "@/utils/storageManager";

const storage = StorageManager.new();
const ui = new UI();

new CanvasController("#game", ui, storage);
