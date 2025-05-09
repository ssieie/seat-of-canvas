export interface Graphic {
  groups: Record<string, Group>; // group_id 作为 key
  elements: Record<string, Element>; // element_id 作为 key
  groupElements: Record<string, string[]>; // group_id -> element_id 列表
}

type GroupType = 'rectangle' | 'circle' | 'triangle' | 'polygon';

export interface Group {
  group_id: string;
  group_name: string;
  z_index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
  type: GroupType;
  //
}

export interface Element {
  id: string;
  group_by: string
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  // 矩阵组特有
  pos?: [number, number]
  // 业务相关
  text?: string
}
