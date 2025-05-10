import {throttle} from "../../../utils/common.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import {getGraphicGroups} from "../graphic/graphicUtils.ts";
import {getTransformState} from "../transform/transform.ts";

const store = RuntimeStore.getInstance();

const getCanvas = () => {
  return store.getState('cvs')
}

const toCanvasCoords = (e: MouseEvent) => {
  const {offsetX, offsetY, scale} = getTransformState();
  const canvas = getCanvas()

  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    // DOM -> 像素坐标
    const px = (e.clientX - rect.left) * (canvas.width / rect.width);
    const py = (e.clientY - rect.top) * (canvas.height / rect.height);

    // 像素坐标 -> 逻辑坐标（反变换）
    const mx = (px - offsetX) / scale;
    const my = (py - offsetY) / scale;

    return {mx, my};
  }

  return null
}


const mousemoveTargetHandler = (e: MouseEvent) => {
  const mxy = toCanvasCoords(e);
  if (mxy) {
    scheduleHitTest(mxy);
  }
}

let idleCallbackId: number | null = null;

function scheduleHitTest({mx, my}: { mx: number, my: number }) {
  if (idleCallbackId) {
    cancelIdleCallback(idleCallbackId!);
    idleCallbackId = null;
  }
  idleCallbackId = requestIdleCallback(_deadline => {
    const rects = getGraphicGroups()
    for (const r of rects) {
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        r.hover = true;
        r.z_index = 1
      } else {
        r.hover = false;
        r.z_index = 0
      }
    }
    idleCallbackId = null;
  }, {timeout: 1000});
}

export const mousemoveTargetThrottleHandler = throttle(mousemoveTargetHandler, 200)
