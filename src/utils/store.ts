import { config } from "@/config";

export class Store {
  static content: LocalStorage;

  static init() {
    this.content = config.localStorage.default;
  }

  static save() {
    const parsed = config.localStorage.parser(this.content);
    localStorage.setItem("geometry crack", JSON.stringify(parsed));
  }

  static clear() {
    this.init();
    localStorage.setItem("geometry crack", JSON.stringify(this.content));
  }
}
