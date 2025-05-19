import type { OperateFunc } from "./core.types.ts";
import { throttle } from '../utils/common.ts';
import '../style.css';
export declare function resize(w: number, h: number): void;
export declare function init(target: HTMLElement, fps?: number): Promise<OperateFunc>;
export declare function exit(): void;
export { throttle };
