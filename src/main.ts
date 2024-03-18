import "./main.css";
import "./fonts.ts";
import { CanvasController } from "./canvas";
import { UI } from "./ui";
import { Store } from "@/utils/store";

Store.init();
const ui = new UI();

new CanvasController("#game", ui);
