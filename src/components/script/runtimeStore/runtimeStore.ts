import type {ContainerTransformState} from "../container/container.type.ts";
import type {Graphic, Group} from "../graphic/graphic.types.ts";


type RuntimeState = {
  cvs: HTMLCanvasElement | null;
  containerTransformState: ContainerTransformState
  graphicMatrix: Graphic
};

export type GraphicGroups = 'graphicMatrix'

function initRuntimeState(): RuntimeState {
  return {
    cvs: null,
    containerTransformState: {
      lastX: 0,
      lastY: 0,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    },
    graphicMatrix: {
      groups: {},
      elements: {},
      groupElements: {}
    },
  }
}

type Listeners = {
  [K in keyof RuntimeState]: Set<(val: RuntimeState[K], old: RuntimeState[K]) => void>;
};

class RuntimeStore {
  private static instance: RuntimeStore;
  private state: RuntimeState;
  private listeners = {} as Listeners

  private constructor() {
    this.state = initRuntimeState()
  }

  static getInstance(): RuntimeStore {
    if (!RuntimeStore.instance) {
      RuntimeStore.instance = new RuntimeStore();
    }
    return RuntimeStore.instance;
  }

  // 1. 获取全部
  // 2. 获取单个字段
  // 3. 获取多个字段
  getState(): RuntimeState;
  getState<K extends keyof RuntimeState>(key: K): RuntimeState[K];
  getState<K extends keyof RuntimeState>(...keys: K[]): Pick<RuntimeState, K>;
  getState<K extends keyof RuntimeState>(...keys: K[]): any {
    if (keys.length === 0) {
      return {...this.state}; // 全部
    }
    if (keys.length === 1) {
      return this.state[keys[0]]; // 单个字段
    }
    const result = {} as Pick<RuntimeState, K>;
    keys.forEach((key) => {
      result[key] = this.state[key];
    });
    return result; // 多字段
  }

  updateState<K extends keyof RuntimeState>(key: K, value: RuntimeState[K]) {
    const oldValue = this.state[key];
    if (oldValue !== value) {
      this.state[key] = value;
      this.notify(key, value, oldValue);
    }
  }

  // 订阅特定字段
  subscribe<K extends keyof RuntimeState>(key: K, listener: (val: RuntimeState[K], old: RuntimeState[K]) => void, immediately = false) {
    if (!this.listeners[key]) {
      this.listeners[key] = new Set() as Listeners[K];
    }
    this.listeners[key].add(listener);
    // 立即触发一次
    immediately && listener(this.state[key], this.state[key]);
  }

  // 取消订阅
  unsubscribe<K extends keyof RuntimeState>(key: K, listener: (val: RuntimeState[K], old: RuntimeState[K]) => void) {
    this.listeners[key]?.delete(listener);
  }

  // 取消订阅
  unsubscribeAll() {
    Object.keys(this.listeners).forEach((listener) => {
      this.listeners[listener as keyof RuntimeState].clear()
    })

    this.listeners = {} as Listeners
  }

  // 通知监听器
  private notify<K extends keyof RuntimeState>(key: K, newValue: RuntimeState[K], oldValue: RuntimeState[K]) {
    this.listeners[key]?.forEach((listener) => {
      listener(newValue, oldValue);
    });
  }

  // 获取画布上已有的全部组
  getGraphicGroups(graphic: GraphicGroups[]) {
    const res: Group[] = []
    const graphicSet = Array.from(new Set(graphic))
    for (const key of graphicSet) {
      res.push(...Object.values(this.state[key].groups))
    }
    return res;
  }

  reset() {
    this.state = initRuntimeState()
  }
}

export default RuntimeStore;
