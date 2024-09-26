// import files and modules

class Enemy{
  readonly bossname:string = "Boss";
  name:string;
  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }
}
BossProperties = {
  life: "",
  offensive: true,
  levels: ""
}
