import { Group, Element } from '../graphic/graphic.types';

export function occupyASeatRule(group: Group, element: Element): boolean {
  return element.status === 'idle'
}

export function cancelSeatOccupancyRule(group: Group, element: Element): boolean {
  return element.status === 'occupy'
}

export function editorialStaffRule(group: Group, element: Element): boolean {
  return element.status === 'idle'
}

export function deletePersonnelRule(group: Group, element: Element): boolean {
  return element.status === 'full'
}

export function coveringRule(group: Group, element: Element): boolean {
  return element.status === 'idle'
}

export function coveringAllRule(group: Group, element: Element): boolean {
  return element.status === 'idle' && !!group.group_set_id
}
