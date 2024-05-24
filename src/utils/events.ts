type EventFunc<TEventType extends keyof HTMLElementEventMap | keyof DocumentEventMap> = {
  type: TEventType;
  func: (
    e: TEventType extends keyof HTMLElementEventMap ? HTMLElementEventMap[TEventType] : DocumentEventMap[TEventType]
  ) => void;
  domElement: HTMLElement | Document;
};
type Events<TGroup extends string> = Record<TGroup, EventFunc<keyof HTMLElementEventMap | keyof DocumentEventMap>[]>;

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
    const eventObj = { type, func, domElement } as EventFunc<
      keyof HTMLElementEventMap | keyof DocumentEventMap | TEventType
    >;
    this.events[group] ??= [];
    this.events[group].push(eventObj);
  }

  addDocument<TEventType extends keyof DocumentEventMap>(
    group: TGroup,
    type: TEventType,
    func: (e: DocumentEventMap[TEventType]) => void
  ) {
    const eventObj = { type, func, domElement: document } as EventFunc<
      keyof DocumentEventMap | keyof HTMLElementEventMap | TEventType
    >;
    this.events[group] ??= [];
    this.events[group].push(eventObj);
  }
}
