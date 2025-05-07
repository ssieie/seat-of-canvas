import type {Canvaser} from "../core/core.types.ts";

class Container {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  private dragging = false
  private lastX = 0
  private lastY = 0

  private offsetX = 0
  private offsetY = 0
  private scale = 1

  constructor(w: number, h: number, cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen

    this.resize(w, h)

    this.addEvents()
  }

  resize(width: number, height: number) {
    if (!this.canvas || !this.ctx) return
    this.canvas.width = width
    this.canvas.height = height
  }

  private addEvents() {
    if (!this.canvas) return

    // 拖动事件
    this.canvas.addEventListener('mousedown', (e) => {
      this.dragging = true
      this.lastX = e.clientX
      this.lastY = e.clientY
    })

    window.addEventListener('mousemove', (e) => {
      if (!this.dragging) return
      const dx = e.clientX - this.lastX
      const dy = e.clientY - this.lastY
      this.lastX = e.clientX
      this.lastY = e.clientY

      this.offsetX += dx
      this.offsetY += dy
    })

    window.addEventListener('mouseup', () => {
      this.dragging = false
    })

    // 缩放事件（滚轮）
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault()

      const zoomFactor = 1.1
      const oldScale = this.scale
      const mouseX = e.offsetX
      const mouseY = e.offsetY

      if (e.deltaY < 0) {
        this.scale *= zoomFactor
      } else {
        this.scale /= zoomFactor
      }

      // 保持缩放中心在鼠标位置
      const scaleChange = this.scale / oldScale
      this.offsetX = mouseX - (mouseX - this.offsetX) * scaleChange
      this.offsetY = mouseY - (mouseY - this.offsetY) * scaleChange

    }, {passive: false})
  }

  draw() {
    if (!this.ctx || !this.canvas) return
    const ctx = this.ctx
    ctx.save()

    // 清空并应用变换
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY)

    // 画内容（可以替换成你自己的图形）
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(-1000, -1000, 2000, 2000) // 背景大点方便拖动

    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, 200, 200)

    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(400, 200, 80, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  clear() {
    //
  }
}

export default Container
