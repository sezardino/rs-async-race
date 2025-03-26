export class Signal<T> {
  private value: T;
  private subscribers: Set<(value: T) => void>;

  constructor(
    initialValue: T,
    initialSubscriptions: ((value: T) => void)[] = []
  ) {
    this.value = initialValue;
    this.subscribers = new Set();

    initialSubscriptions.forEach((callback) => this.subscribe(callback));
  }

  public get(): T {
    return this.value;
  }

  public set(newValue: T): void {
    if (newValue !== this.value) {
      this.value = newValue;
      this.notify();
    }
  }

  public subscribe(callback: (value: T) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify(): void {
    this.subscribers.forEach((callback) => callback(this.value));
  }
}
