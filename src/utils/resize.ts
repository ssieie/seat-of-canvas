// 盒子大小变动相关
import { resize } from '../core/core';
import {throttle} from '../utils/common'

const resizeHandler = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0];
  if (entry && entry.contentRect) {
    const { width, height } = entry.contentRect;
    resize(width, height);
  }
};
const resizeThrottleHandler = throttle(resizeHandler, 300);

const resizeObserver = new ResizeObserver(resizeThrottleHandler);

export const resizeMount = (target: HTMLElement) => {
  resizeObserver.observe(target);
};

export const resizeUnmount = (target: HTMLElement) => {
  resizeObserver.unobserve(target);
};
