interface Storage {
  HS: number;
}

export class LocalStorage {
  content: Storage;

  constructor() {
    const str = localStorage.getItem("geometry crack");
    if (str) {
      this.content = JSON.parse(str);
      return;
    }
    this.content = this.initStorage();
  }
  private initStorage(): Storage {
    return {
      HS: 0,
    };
  }
  save() {
    localStorage.setItem("geometry crack", JSON.stringify(this.content));
  }
}
