import {throttle} from "../../../utils/common.ts";
import RuntimeStore, {allGraphicGroups} from "../runtimeStore/runtimeStore.ts";
import {getTransformState} from "../transform/transform.ts";
import type {Group} from "../graphic/graphic.types.ts";

const store = RuntimeStore.getInstance();

const getCanvas = () => store.getState('cvs');

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
  const pos = toCanvasCoords(e);
  if (pos) {
    scheduleHitTest(pos);
  }
}

let idleCallbackId: number | null = null;

let prevHitGroupIds = new Set<string>();

// 更新 hover 状态
function updateHoverState(hitIds: Set<string>) {
  const allGroups = store.getGraphicGroups(allGraphicGroups);
  // 清除上一次命中的 hover 状态
  for (const groupId of prevHitGroupIds) {
    if (!hitIds.has(groupId)) {
      const group = allGroups.get(groupId);
      if (group) {
        group.hover = false;
        group.z_index = 0;
      }
    }
  }

  for (const group_id of hitIds.values()) {

    if (allGroups.has(group_id)) {
      const hitG: Group = allGroups.get(group_id)!
      hitG.hover = true;
      hitG.z_index = 1;
    }

  }

  // 保存本次命中的 group_id 集合
  prevHitGroupIds = hitIds;
}

function scheduleHitTest({mx, my}: { mx: number, my: number }) {
  if (idleCallbackId) {
    cancelIdleCallback(idleCallbackId!);
    idleCallbackId = null;
  }
  idleCallbackId = requestIdleCallback(_deadline => {
    const groupTree = store.getState('groupTree');
    const hits = groupTree.search({
      minX: mx,
      minY: my,
      maxX: mx,
      maxY: my
    });

    const hitIds = new Set(hits.map((g: any) => g.group_id));

    updateHoverState(hitIds);

    idleCallbackId = null;
  }, {timeout: 300});
}

export const mousemoveTargetThrottleHandler = throttle(mousemoveTargetHandler, 100)
// export const mousemoveTargetThrottleHandler = mousemoveTargetHandler
