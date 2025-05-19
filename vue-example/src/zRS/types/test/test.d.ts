import type { Canvaser } from "../core/core.types.ts";
declare class Test {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    constructor(cv: Canvaser);
    draw(): void;
    clear(): void;
}
export default Test;
