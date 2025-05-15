import behaviorTasksInstance from "../behaviorTasks/behaviorTasks.ts";
import type {ContainerTransformState} from "../container/container.type.ts";
import {getTransformState} from "./transform.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import {delBehavior} from "../behaviorTasks/behaviorController.ts";
import PubSub from "../utils/pubSub.ts";

const store = RuntimeStore.getInstance();

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function setTransformFrame(endState: { offsetX: number, offsetY: number, scale: number }, duration = 300) {
  const startTime = performance.now();
  const {scale, offsetX, offsetY} = getTransformState();

  const startState = {
    offsetX,
    offsetY,
    scale,
  };

  behaviorTasksInstance.addBehavior<ContainerTransformState>(
    "resetTransform",
    () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const easeOut = t * (2 - t);

      // 动画完成时移除任务
      if (t >= 1) {
        delBehavior("resetTransform");
        PubSub.publish('calculateProportion')
      }

      return {
        offsetX: lerp(startState.offsetX, endState.offsetX, easeOut),
        offsetY: lerp(startState.offsetY, endState.offsetY, easeOut),
        scale: lerp(startState.scale, endState.scale, easeOut),
        lastX: 0,
        lastY: 0,
      };
    },
    (val) => {
      store.updateState('containerTransformState', val)
    },
    1000 / 60, // 每秒 60 次
    true
  );
}
