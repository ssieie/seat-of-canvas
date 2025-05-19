import type { Graphic } from "../graphic.types.ts";
declare class Matrix {
    graphicData: Graphic;
    constructor();
    addMatrixGraphic(name: string, row: number, col: number, _element?: Element[]): void;
    clear(): void;
}
export default Matrix;
