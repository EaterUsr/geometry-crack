type EventFunc<TEventType extends keyof HTMLElementEventMap> = {
  type: TEventType;
  func: (e: HTMLElementEventMap[TEventType]) => void;
  domElement: HTMLElement;
};
type Events<TGroup extends string> = Record<TGroup, EventFunc<keyof HTMLElementEventMap>[]>;

export class EventList<TGroup extends string> {
  constructor(private events: Events<TGroup> = {} as Events<TGroup>) {}

  enable(group: TGroup) {
    this.events[group].forEach(({ type, func, domElement }) => {
      domElement.addEventListener(type, func);
    });
  }
  disable(group: TGroup) {
    this.events[group].forEach(({ type, func, domElement }) => {
      domElement.removeEventListener(type, func);
    });
  }
  add<TEventType extends keyof HTMLElementEventMap>(
    group: TGroup,
    type: TEventType,
    func: (e: HTMLElementEventMap[TEventType]) => void,
    domElement: HTMLElement
  ) {
    const eventObj = { type, func, domElement } as EventFunc<keyof HTMLElementEventMap | TEventType>;
    this.events[group] ??= [];
    this.events[group].push(eventObj);
  }
}
