import type { Canvaser, ContextMenuOperateFunc, GraphicOperateFunc } from "../core/core.types.ts";
import Matrix from "./matrix/matrix.ts";
import OperateGraphic from "./operateGraphic.ts";
import Circle from "./circle/circle.ts";
import Strip from "./strip/strip.ts";
declare class GraphicMain extends OperateGraphic {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    matrix: Matrix;
    circle: Circle;
    strip: Strip;
    constructor(cv: Canvaser);
    draw(): void;
    clear(): void;
    operate(): GraphicOperateFunc;
    contextMenuOperate(): ContextMenuOperateFunc;
}
export default GraphicMain;
