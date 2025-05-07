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
  <div class="wrapper" ref="wrapperRef"></div>
</template>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
