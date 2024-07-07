export type Node<TValue> = { value: TValue; next: null | Node<TValue> };

export class ViewItems<TValue> {
  private head: null | Node<TValue> = null;
  private tail: null | Node<TValue> = null;
  public length = 0;

  constructor() {}

  private makeNode(value: TValue, next?: Node<TValue> | null): Node<TValue> {
    return {
      value,
      next: next ?? null,
    };
  }

  append(...values: TValue[]) {
    this.length += values.length;

    let prevNode = this.tail;
    for (const i in values) {
      let currNode = this.makeNode(values[i]);

      if (prevNode) {
        prevNode.next = currNode;
        prevNode = currNode;
        continue;
      }

      this.head = currNode;
      this.tail = currNode;
      prevNode = currNode;
    }

    this.tail = prevNode;
  }

  forEach(cb: (element: TValue, index: number) => void | boolean) {
    let current = this.head;
    let index = 0;
    let prev = this.head;

    while (current) {
      const shouldRemove = cb(current.value, index);

      if (shouldRemove) {
        if (prev) {
          prev.next = current.next;
        } else {
          this.head = current.next;
        }
      }

      prev = current;
      current = current.next;
      index++;
    }
  }

  removeFirst() {
    this.length--;

    if (!this.head) {
      console.log("Can't remove");
      return;
    }

    let nodeToRemove = this.head;
    this.head = nodeToRemove.next;

    if (nodeToRemove === this.tail) {
      this.tail = null;
    }
  }

  getLast(): Node<TValue> | null {
    return this.tail;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}
