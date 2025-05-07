type Callback<T extends any[] = any[]> = (...args: T) => void;

type MyEvents = {
  mousedown: [MouseEvent];
  mousemove: [MouseEvent];
  mouseup: [MouseEvent];
  wheel: [WheelEvent];
};

class PubSub<Events extends Record<string, any[]>> {
  private events: {
    [K in keyof Events]?: Callback<Events[K]>[];
  } = {};

  subscribe<K extends keyof Events>(event: K, callback: Callback<Events[K]>): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(callback);
    return () => this.unsubscribe(event, callback);
  }

  publish<K extends keyof Events>(event: K, ...args: Events[K]): void {
    this.events[event]?.forEach(callback => callback(...args));
  }

  unsubscribe<K extends keyof Events>(event: K, callback: Callback<Events[K]>): void {
    const callbacks = this.events[event];
    if (callbacks) {
      this.events[event] = callbacks.filter(cb => cb !== callback);
    }
  }

  once<K extends keyof Events>(event: K, callback: Callback<Events[K]>): void {
    const onceWrapper: Callback<Events[K]> = (...args) => {
      callback(...args);
      this.unsubscribe(event, onceWrapper);
    };
    this.subscribe(event, onceWrapper);
  }

  clear<K extends keyof Events>(event: K): void {
    if (this.events[event]) {
      this.events[event] = [];
    }
  }

  clearAll(): void {
    this.events = {};
  }
}

export default new PubSub<MyEvents>();
