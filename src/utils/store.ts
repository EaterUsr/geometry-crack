import { config } from "@/config";

export class Store {
  static content: LocalStorage;

  static init() {
    const content = localStorage.getItem("geometry crack");
    this.content = content ? JSON.parse(content) : config.localStorage.default;
  }

  static save() {
    const parsed = config.localStorage.parser(this.content);
    localStorage.setItem("geometry crack", JSON.stringify(parsed));
  }

  static clear() {
    this.content = config.localStorage.default;
    localStorage.setItem("geometry crack", JSON.stringify(this.content));
  }
}
