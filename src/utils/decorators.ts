import { truncNbr } from "@/utils/math";

export function trunc(decimals?: number) {
  return function <T extends Object, U extends keyof T>(target: T, key: U) {
    const value = target[key];

    Object.defineProperty(target, key, {
      get: () => value,
      set: (nbr: unknown): number => {
        if (typeof nbr !== "number") throw new Error("Invalid property: Must receive a number");

        return truncNbr(nbr, decimals);
      },
    });
  };
}
