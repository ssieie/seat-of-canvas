import RuntimeStore from "../runtimeStore/runtimeStore.ts";

const store = RuntimeStore.getInstance();

export function getTransformState() {
  return store.getState('containerTransformState');
}

// 原坐标转为屏幕坐标
export function originToScreen(x: number, y: number) {
  const {scale, offsetX, offsetY} = getTransformState();
  return {
    x: x * scale + offsetX,
    y: y * scale + offsetY
  };
}

// 屏幕坐标转为原坐标
function screenToOrigin(x: number, y: number) {
  const {scale, offsetX, offsetY} = getTransformState();
  return {
    x: (x - offsetX) / scale,
    y: (y - offsetY) / scale
  }
}

export function scaleSize(size: number) {
  return size * getTransformState().scale;
}

