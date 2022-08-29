import List from "./list";

export default function makeListController<T extends { update: (speed: number) => unknown }>(
  frequency: number,
  speed: number,
  width: number,
  elementInstance: () => T
): (speed: number) => void {
  const count = 2 + 1 / frequency;
  const spaceTime = (width * frequency) / speed;

  const elements = new List<T>();

  let i = 0;
  while (i < count) {
    i++;
    elements.append(elementInstance());
  }
  elements.forEach((element, index) => {
    element.update(spaceTime * (Math.floor(count - index) - 1));
  });

  setInterval(() => {
    elements.append(elementInstance());
    elements.removeFirst();
  }, spaceTime);

  return (speed: number) => {
    console.log(speed);
    elements.forEach(element => {
      element.update(speed);
    });
  };
}
