import type { Element, RBushGroupItem } from "../graphic/graphic.types.ts";
type Callback<T extends any[] = any[]> = (...args: T) => void;
type MyEvents = {
    mousedown: [MouseEvent];
    mousedown_dnh: [MouseEvent];
    mousedown_group: [MouseEvent, string];
    mousedown_element: [MouseEvent, Element, RBushGroupItem];
    mousemove: [MouseEvent];
    mouseup: [MouseEvent];
    wheel: [WheelEvent];
    calculateProportion: [];
};
declare class PubSub<Events extends Record<string, any[]>> {
    private events;
    subscribe<K extends keyof Events>(event: K, callback: Callback<Events[K]>): () => void;
    publish<K extends keyof Events>(event: K, ...args: Events[K]): void;
    unsubscribe<K extends keyof Events>(event: K, callback: Callback<Events[K]>): void;
    once<K extends keyof Events>(event: K, callback: Callback<Events[K]>): void;
    clear<K extends keyof Events>(event: K): void;
    clearAll(): void;
}
declare const _default: PubSub<MyEvents>;
export default _default;
