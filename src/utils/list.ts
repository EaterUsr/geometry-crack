type node<T> = { value: T; next: null | node<T> };

export class List<T> {
  private head: null | node<T>;
  private tail: null | node<T>;
  public length = 0;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  private makeNode(value: T): node<T> {
    return {
      value,
      next: null,
    };
  }

  append(value: T): node<T> {
    let node = this.makeNode(value);
    this.length++;

    if (this.tail) {
      this.tail.next = node;
      this.tail = node;

      return node;
    }

    this.head = this.tail = node;
    return node;
  }

  forEach(cb: (element: T, index: number) => void) {
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
