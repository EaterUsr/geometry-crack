import { config } from "@/config";
import { LocalStorage } from "@/types/config";

export class Store {
  static content: LocalStorage;

  static init() {
    const content = localStorage.getItem("geometry crack");
    this.content = content ? this.updateConfig(JSON.parse(content)) : config.localStorage.default;
  }

  static save() {
    const parsed = config.localStorage.parser(this.content);
    localStorage.setItem("geometry crack", JSON.stringify(parsed));
  }

  static clear() {
    this.content = config.localStorage.default;
    localStorage.setItem("geometry crack", JSON.stringify(this.content));
  }

  private static updateConfig(content: Record<keyof LocalStorage, unknown>) {
    Object.keys(config.localStorage.default).forEach(value => {
      const key = value as keyof LocalStorage;

      if (key in content) return;

      content[key] = config.localStorage.default[key];
    });

    return content as LocalStorage;
  }
}
