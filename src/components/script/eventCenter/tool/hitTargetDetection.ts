import {throttle} from "../../../../utils/common.ts";
import RuntimeStore from "../../runtimeStore/runtimeStore.ts";
import {getTransformState} from "../../transform/transform.ts";

const store = RuntimeStore.getInstance();

const getCanvas = () => store.getState('cvs');

export const toCanvasCoords = (e: MouseEvent) => {
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


export const mousemoveTargetHandler = (e: MouseEvent) => {
  if (store.getState('highlightElements')) {
    const pos = toCanvasCoords(e);
    if (pos) {
      scheduleHitTest(pos);
    }
  }
}

// let idleCallbackId: number | null = null;

let prevHitGroupIds = new Set<string>();

// 更新 hover 状
export function updateHoverState(hitIds: Set<string>) {
  // 清除上一次命中的 hover 状态
  for (const groupId of prevHitGroupIds) {
    if (!hitIds.has(groupId)) {
      const group = store.getGraphicGroupsById(groupId);
      if (group) {
        group.hover = false;
        group.z_index = 0;
      }
    }
  }

  for (const group_id of hitIds.values()) {
    const group = store.getGraphicGroupsById(group_id)
    if (group) {
      group.hover = true;
      group.z_index = 1;
    }

  }

  // 保存本次命中的 group_id 集合
  prevHitGroupIds = hitIds;
}

function scheduleHitTest({mx, my}: { mx: number, my: number }) {
  const groupTree = store.getState('groupTree');
  const hits = groupTree.search({
    minX: mx,
    minY: my,
    maxX: mx,
    maxY: my
  });

  const groupIds = hits.sort((a, b) => b.z_index - a.z_index).map((g: any) => g.group_id)
  const hitIds = new Set([groupIds[0]]);

  updateHoverState(hitIds);

  // if (idleCallbackId) {
  //   cancelIdleCallback(idleCallbackId!);
  //   idleCallbackId = null;
  // }
  // idleCallbackId = requestIdleCallback(_deadline => {
  //   const groupTree = store.getState('groupTree');
  //   const hits = groupTree.search({
  //     minX: mx,
  //     minY: my,
  //     maxX: mx,
  //     maxY: my
  //   });
  //
  //   const hitIds = new Set(hits.map((g: any) => g.group_id));
  //
  //   updateHoverState(hitIds);
  //
  //   idleCallbackId = null;
  // }, {timeout: 100});
}

export const mousemoveTargetThrottleHandler = throttle(mousemoveTargetHandler, 150)

export const didNotHitAnyElement = (e: MouseEvent) => {
  const pos = toCanvasCoords(e);
  if (pos) {
    const groupTree = store.getState('groupTree');
    const hits = groupTree.search({
      minX: pos.mx,
      minY: pos.my,
      maxX: pos.mx,
      maxY: pos.my
    });

    if (hits.length === 0) return null;

    // 找出 z_index 最大的 group
    const topGroup = hits.reduce((max, curr) => {
      return (curr.z_index > max.z_index) ? curr : max;
    }, hits[0]);

    return topGroup;
  }

  return null
}