type node<T> = { value: T; next: null | node<T> };

function makeNode<T>(value: T): node<T> {
  return {
    value,
    next: null,
  };
}

interface IList<T> {
  append: (value: T) => node<T>;
  forEach: (cb: (element: T, index: number) => unknown) => void;
  removeFirst: () => node<T> | null;
  length: number;
}

export default class List<T> implements IList<T> {
  private head: null | node<T>;
  private tail: null | node<T>;
  public length = 0;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(value: T): node<T> {
    let node = makeNode(value);
    this.length++;

    if (this.tail) {
      this.tail.next = node;
      this.tail = node;

      return node;
    }

    this.head = this.tail = node;
    return node;
  }

  forEach(cb: (element: T, index: number) => unknown): void {
    let current = this.head;
    let index = 0;

    while (current) {
      cb(current.value, index);
      current = current.next;
      index++;
    }
  }

  removeFirst(): node<T> | null {
    this.length--;

    if (!this.head) {
      return null;
    }

    let nodeToRemove = this.head;
    this.head = nodeToRemove.next;

    nodeToRemove.next = null;

    if (nodeToRemove === this.tail) {
      this.tail = null;
    }

    return nodeToRemove;
  }
}
