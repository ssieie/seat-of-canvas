import {scaleSize} from "../transform/transform.ts";

type TextAlignType = 'start' | 'end' | 'left' | 'right' | 'center'
type TextBaselineType = 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom'

export function setCtxFont(ctx: CanvasRenderingContext2D, color: string, textAlign: TextAlignType, textBaseline: TextBaselineType = 'alphabetic', fontSize = 13) {
  ctx.font = `${scaleSize(fontSize)}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
}
