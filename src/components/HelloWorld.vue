<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue'
import {init, exit, resize} from "./script/core/core.ts";
import {throttle} from './script/utils/common.ts'
import type {OperateFunc} from "./script/core/core.types.ts";

const wrapperRef = ref<HTMLElement | null>(null)

const resizeHandler = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0]
  if (entry && entry.contentRect) {
    const {width, height} = entry.contentRect
    resize(width, height)
  }
}
const resizeThrottleHandler = throttle(resizeHandler, 300)

const resizeObserver = new ResizeObserver(resizeThrottleHandler)

let cFunc: OperateFunc = null

const addM = (row: number, col: number) => {
  if (cFunc) {
    cFunc.graphicOperateFunc.addMatrixGraphic('测试1', row, col)
  }
}
const addC = (num: number) => {
  if (cFunc) {
    cFunc.graphicOperateFunc.addCircleGraphic('测试circle', num)
  }
}
const addS = (sNum: number, lNum: number) => {
  if (cFunc) {
    cFunc.graphicOperateFunc.addStripGraphic('测试Strip', sNum, lNum)
  }
}

const getData = () => {
  console.log(cFunc?.getData())
}

const saveToImg = () => {
  cFunc?.saveToImages()
}

const addMTest = (row: number, col: number) => {
  if (cFunc) {
    console.time('getBasicPos start')
    for (let i = 0; i < 100; i++) {
      cFunc.graphicOperateFunc.addMatrixGraphic('测试1', row, col)
    }
    console.timeEnd('getBasicPos start')
  }
}


onMounted(async () => {
  if (wrapperRef.value) {

    cFunc = await init(wrapperRef.value, 60)

    resizeObserver.observe(wrapperRef.value)

    addM(2, 2)

    addC(8)

    addS(3, 4)
  }
})

onBeforeUnmount(() => {
  if (wrapperRef.value) {
    resizeObserver.unobserve(wrapperRef.value)
    exit()
    cFunc = null
  }
})

</script>

<template>
  <div class="btns">
    <div class="btn" @click="addM(2,2)">+矩形2*2</div>
    <!--    <div class="btn" @click="addM(3,3)">+矩形3*3</div>-->
    <div class="btn" @click="addM(6,4)">+矩形6*4</div>
    <div class="btn" @click="addMTest(6,4)">+矩形6*4 * 100</div>
    <div class="btn" style="background-color: green" @click="addC(50)">+圆形(6)</div>
    <div class="btn" style="background-color: orange" @click="addS(2,3)">+条(2,3)</div>
    <div class="btn" style="background-color: orange" @click="addS(3,5)">+条(3,5)</div>
    <div class="btn" style="background-color: slateblue" @click="getData">获取当前数据</div>
    <div class="btn" style="background-color: sienna" @click="saveToImg">保存为图片</div>
  </div>
  <div class="content">
    <div class="wrapper" @contextmenu.prevent ref="wrapperRef"></div>
  </div>
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

.content {
  width: 96%;
  height: calc(100vh - 90px);
  margin: 0 auto;
  border: 1px solid #ccc;
}

.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
