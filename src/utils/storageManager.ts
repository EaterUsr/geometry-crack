import { config } from "@/config";

export class StorageManager {
  private static instance: StorageManager;
  content: LocalStorage;

  private constructor() {
    const str = localStorage.getItem("geometry crack");
    if (str) {
      this.content = JSON.parse(str);
      return;
    }
    this.content = this.initStorage();
  }
  static new() {
    if (this.instance) return this.instance;
    this.instance = new StorageManager();
    return this.instance;
  }
  private initStorage(): LocalStorage {
    return config.localStorage.default;
  }
  save() {
    const parsed = config.localStorage.parser(this.content);
    localStorage.setItem("geometry crack", JSON.stringify(parsed));
  }
  clear() {
    this.content = this.initStorage();
    localStorage.setItem("geometry crack", JSON.stringify(this.content));
  }
}
