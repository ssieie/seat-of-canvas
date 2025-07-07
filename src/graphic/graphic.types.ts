export interface Graphic {
  groups: Record<GroupType, Record<string, Group>>; // 组ID与组的MAP
  elements: Record<string, Element>; // 元素ID与元素的MAP
  groupElements: Record<string, string[]>; // 组id与元素id[]的MAP
  // groupElementsMatrix: Record<string, Element[][]>; // 方便矩阵操作更直观
}

export type POS = { x: number; y: number };

export type StripPos = "top" | "bottom" | "left" | "right";

export type IncreaseElementPos = "before" | "after";

export type GroupType = "rectangle" | "circle" | "strip";

export interface Group {
  group_id: string;
  group_name: string;
  z_index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  hover: boolean;
  size: number;
  type: GroupType;
  //
  baseFontSize: number;
  // 圆形专有
  radius?: number;
  // 矩阵专有
  // 编号方式 1 依次排列 2 中间到两边
  index_rule?: "1" | "2";
  // 圆桌方桌同时添加多个的情况下
  group_set_name?: string;
  group_set_id?: string;
}

export type RBushGroupItem = Group & {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type ElementStatus = "idle" | "occupy" | "full";

export interface Element {
  id: string;
  group_by: string;
  groupName?: string;
  index: number;
  // 组内坐标用于正常渲染
  x: number;
  y: number;
  // 拖拽时坐标
  isDragging: boolean;
  dX: number;
  dY: number;
  width: number;
  height: number;
  highlight?: boolean;
  // 矩阵组特有
  pos?: [number, number];
  index1: number; // 中间到两边编号规则的值
  // 条状特有
  strip?: {
    pos: StripPos;
    idx: number;
  };
  // 业务相关
  status: ElementStatus;
  text?: string;
  business_id?: string;
  //
  baseFontSize: number;
  nameFontSize: number;
}
