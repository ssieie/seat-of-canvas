<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {init, exit, resize} from "./script/core/core.ts";
import {throttle} from '../utils/common.ts'

const wrapperRef = ref<HTMLElement | null>(null)

const resizeHandler = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0]
  if (entry && entry.contentRect) {
    const {width, height} = entry.contentRect
    console.log('Size changed:', width, height)
    resize(width, height)
  }
}
const resizeThrottleHandler = throttle(resizeHandler, 300)

const resizeObserver = new ResizeObserver(resizeThrottleHandler)

onMounted(() => {
  if (wrapperRef.value) {
    resizeObserver.observe(wrapperRef.value)

    init(wrapperRef.value, 60)
  }
})

onUnmounted(() => {
  if (wrapperRef.value) {
    exit()
    resizeObserver.unobserve(wrapperRef.value)
  }
})

</script>

<template>
  <div class="btns">
    <div class="btn">+矩形3*3</div>
    <div class="btn">+矩形6*4</div>
  </div>
  <div class="wrapper" @contextmenu.prevent ref="wrapperRef"></div>
</template>

<style scoped>
.btns {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn {
  background: blue;
  padding: 2px 10px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.wrapper {
  width: 100vw;
  height: calc(100vh - 40px);
  overflow: hidden;
}
</style>
