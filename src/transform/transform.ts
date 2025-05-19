import RuntimeStore from "../runtimeStore/runtimeStore";

const store = RuntimeStore.getInstance();

export const getCanvas = () => store.getState('cvs');

export function getTransformState() {
  return store.getState('containerTransformState');
}

// 原坐标转为屏幕坐标
export function canvasToScreen(x: number, y: number): [number, number] {
  const {scale, offsetX, offsetY} = getTransformState();
  return [
    (x * scale + offsetX),
    (y * scale + offsetY)
  ];
}

// 屏幕坐标转为原坐
export const screenToCanvas = (x: number, y: number): [number, number] => {
  const {scale, offsetX, offsetY} = getTransformState();
  return [
    (x - offsetX) / scale,
    (y - offsetY) / scale,
  ];
}

export function scaleSize(size: number) {
  return size * getTransformState().scale;
}

