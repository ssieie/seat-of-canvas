import type { Element } from "../graphic/graphic.types.ts";
export declare function throttle(func: Function, wait: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): any;
export declare function generateUuid(): string;
export declare function deepCopy(obj: any, cache?: WeakMap<object, any>): any;
export declare function swapInArrayFlexible<T>(arr: T[], a: T, b: T): T[];
export declare function swapElement(e1: Element, e2: Element): void;
export declare function copyElement(e1: Element, e2: Element): void;
