import { config } from "@/config";
import { LocalStorage } from "@/types/config";
import { getGamemode } from "./gamemode";

const migrations: Function[] = [];

export class Store {
  static content: LocalStorage;

  static init() {
    if (getGamemode() === "debug") {
      this.content = config.localStorage.op;
      this.save = () => {};
      return;
    }

    const content = localStorage.getItem("geometry crack");
    this.content = content ? this.updateConfig(JSON.parse(content)) : config.localStorage.default;
    this.save();
  }

  static save() {
    const parsed = config.localStorage.parser(this.content);
    localStorage.setItem("geometry crack", JSON.stringify(parsed));
  }

  static clear() {
    this.content = config.localStorage.default;
    localStorage.setItem("geometry crack", JSON.stringify(this.content));
  }

  private static updateConfig(content: Record<string, unknown>) {
    if (typeof content.version !== "number") return config.localStorage.default;

    let migrated = content;
    while (migrated.version !== config.localStorage.default.version) {
      migrated = migrations[migrated.version as number](migrated);
    }

    return migrated as LocalStorage;
  }
}
