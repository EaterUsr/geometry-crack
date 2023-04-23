export function trunc(decimals = 2) {
  return function <T, U extends keyof T>(target: T, key: U) {
    const value = target[key];

    Object.defineProperty(target, key, {
      get: () => value,
      set: (nbr: unknown): number | never => {
        if (typeof nbr !== "number") throw new Error("Invalid property: Exepted number");

        const multiplier = 10 ** decimals;
        return Math.floor(nbr * multiplier) / multiplier;
      },
    });
  };
}
