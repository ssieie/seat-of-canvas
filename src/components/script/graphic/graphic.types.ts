export interface Graphic {
  groups: Record<GroupType, Record<string, Group>>; // group_id 作为 key
  elements: Record<string, Element>; // element_id 作为 key
  groupElements: Record<string, string[]>; // group_id -> element_id 列表
}

export type GroupType = 'rectangle' | 'circle' | 'ellipse';

export interface Group {
  group_id: string;
  group_name: string;
  z_index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  hover: boolean
  size: number;
  type: GroupType;
  //
}

export type RBushGroupItem = Group & { minX: number, minY: number, maxX: number, maxY: number };

export interface Element {
  id: string;
  group_by: string
  index: number;
  // 组内坐标用于正常渲染
  x: number;
  y: number;
  // 拖拽时坐标
  isDragging: boolean;
  dX: number
  dY: number
  width: number;
  height: number;
  // 矩阵组特有
  pos?: [number, number]
  // 业务相关
  text?: string
}
