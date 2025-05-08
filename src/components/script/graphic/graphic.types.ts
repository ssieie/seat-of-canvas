export interface Group {
  group_id: string;
  group_name: string;
  z_index: number;
  size: number;
}

type ElementType = 'rectangle' | 'circle' | 'triangle' | 'polygon';

export interface Element {
  id: string;
  group_by: string
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
}
