type Node<TValue> = { value: TValue; next: null | Node<TValue> };

export class List<T> {
  private head: null | Node<T>;
  private tail: null | Node<T>;
  public length = 0;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  private makeNode(value: T): Node<T> {
    return {
      value,
      next: null,
    };
  }

  append(value: T): Node<T> {
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

  removeFirst(): Node<T> | null {
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
  getLast(): Node<T> | null {
    return this.tail;
  }
  clear() {
    this.head = null;
    this.tail = null;
  }
}
