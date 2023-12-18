import { smallest } from "@/utils/math";

function calcTarget(position: number, target: number, speed: number, resetNumber?: number) {
  const value = resetNumber
    ? smallest(
        (tar, pos) => tar - pos,
        [target, position],
        [target + resetNumber, position],
        [target, position + resetNumber]
      )
    : target - position;

  if (Math.abs(value) > speed) {
    if (value > 0) {
      return position + speed;
    } else {
      return position - speed;
    }
  }
  return target;
}

export function updateTarget<TPosition extends number | number[]>(
  targetPosition: TargetPosition<TPosition>,
  speedFrame: number,
  defaultUpdate?: (areNull: AreNull<TPosition>, preventContent: TPosition) => void,
  resetNumber?: number
) {
  const { content, target, speed } = targetPosition;

  if (targetPosition.content instanceof Array) {
    const content = targetPosition.content as number[];
    const target = targetPosition.target as (null | number)[];

    (targetPosition.content as number[]) = content.map((position, index) => {
      const targetNbr = target[index];
      if (targetNbr !== null && targetNbr !== position) {
        return calcTarget(position, targetNbr, (speed as number[])[index] * speedFrame, resetNumber);
      }
      if (target !== null) (targetPosition.target as (number | null)[])[index] = null;
      return position;
    });
    if (target.some(nbr => nbr === null))
      if (defaultUpdate)
        defaultUpdate(
          (targetPosition.target as (number | null)[]).map(value => value === null) as AreNull<TPosition>,
          content as TPosition
        );
    return;
  }
  if (typeof target === "number") {
    (targetPosition.content as number) = calcTarget(
      content as number,
      target,
      (speed as number) * speedFrame,
      resetNumber
    );
    if (content === target) (targetPosition.target as number | null) = null;
  }
  if (defaultUpdate) (defaultUpdate as (areNull: boolean, preventContent: TPosition) => void)(false, content);
}
