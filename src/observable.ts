export class Observable<T> {
  private value: T | undefined;
  private observers: ((args: T) => void)[] = [];

  constructor(initialValue?: T) {
    this.value = initialValue ?? undefined;
  }

  subscribe(func: (args: T) => void) {
    this.observers.push(func);
  }

  unsubscribe(func: (args: T) => void) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: T) {
    this.value = data;
    this.observers.forEach((observer) => observer(data));
  }

  get $value() {
    return this.value;
  }
}
