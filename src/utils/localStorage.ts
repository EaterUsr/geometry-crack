import { config } from "@/config";

export class StorageManager {
  content: LocalStorage;

  constructor() {
    const str = localStorage.getItem("geometry crack");
    if (str) {
      this.content = JSON.parse(str);
      return;
    }
    this.content = this.initStorage();
  }
  private initStorage(): LocalStorage {
    return config.localStorage.default;
  }
  save() {
    const parsed = config.localStorage.parser(this.content);
    localStorage.setItem("geometry crack", JSON.stringify(parsed));
  }
}
