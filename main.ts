import './app.css'
import {init, exit, resize, throttle} from "./src";

document.querySelector('.btns')!.addEventListener('click', (e) => {
  console.log(e.target)
})

const wrapperRef = document.getElementById('wrapper')!



wrapperRef.addEventListener('contextmenu', (e) => {
  e.preventDefault();
})

const resizeHandler = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0]
  if (entry && entry.contentRect) {
    const {width, height} = entry.contentRect
    resize(width, height)
  }
}
const resizeThrottleHandler = throttle(resizeHandler, 300)

const resizeObserver = new ResizeObserver(resizeThrottleHandler)

let cFunc: any = null

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

const initCanvas = async () => {
  cFunc = await init(wrapperRef!, 60)

  resizeObserver.observe(wrapperRef!)

  addM(2, 2)
  addM(3, 3)
  addM(4, 4)

  // addC(8)
  //
  // addS(3, 4)
}

initCanvas().then()


// onBeforeUnmount(() => {
//   if (wrapperRef.value) {
//     resizeObserver.unobserve(wrapperRef.value)
//     exit()
//     cFunc = null
//   }
// })
