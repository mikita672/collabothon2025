import { ref, type Ref } from 'vue'
import type { StockDataPoint } from '@/types/news'

export function useChartDrawing() {
  const chartCanvas = ref<HTMLCanvasElement | null>(null)

  const drawChart = (
    canvas: HTMLCanvasElement,
    stockData: StockDataPoint[],
    isPositive: boolean,
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx || !stockData.length) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = 200 * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = '200px'
    ctx.scale(dpr, dpr)

    const paddingLeft = 50
    const paddingRight = 20
    const paddingTop = 20
    const paddingBottom = 30
    const width = rect.width - paddingLeft - paddingRight
    const height = 200 - paddingTop - paddingBottom

    const prices = stockData.map((d) => d.price)
    const minPrice = Math.min(...prices) - 10
    const maxPrice = Math.max(...prices) + 10
    const priceRange = maxPrice - minPrice

    ctx.clearRect(0, 0, rect.width, 200)

    drawGridLines(ctx, paddingLeft, paddingRight, paddingTop, width, height, rect.width)
    drawXAxisLabels(ctx, stockData, paddingLeft, paddingBottom, width, height)
    drawYAxisLabels(ctx, paddingLeft, paddingTop, height, maxPrice, priceRange)
    drawPriceLine(ctx, stockData, paddingLeft, paddingTop, width, height, minPrice, priceRange, isPositive)
  }

  const drawGridLines = (
    ctx: CanvasRenderingContext2D,
    paddingLeft: number,
    paddingRight: number,
    paddingTop: number,
    width: number,
    height: number,
    canvasWidth: number,
  ) => {
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1

    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(paddingLeft, y)
      ctx.lineTo(canvasWidth - paddingRight, y)
      ctx.stroke()
    }
  }

  const drawXAxisLabels = (
    ctx: CanvasRenderingContext2D,
    stockData: StockDataPoint[],
    paddingLeft: number,
    paddingBottom: number,
    width: number,
    height: number,
  ) => {
    ctx.fillStyle = '#6b7280'
    ctx.font = '11px system-ui'
    ctx.textAlign = 'center'

    stockData.forEach((point, index) => {
      if (index % Math.ceil(stockData.length / 5) === 0) {
        const x = paddingLeft + (width / (stockData.length - 1)) * index
        const date = new Date(point.date)
        ctx.fillText(`${date.getMonth() + 1}/${date.getDate()}`, x, 200 - paddingBottom + 20)
      }
    })
  }

  const drawYAxisLabels = (
    ctx: CanvasRenderingContext2D,
    paddingLeft: number,
    paddingTop: number,
    height: number,
    maxPrice: number,
    priceRange: number,
  ) => {
    ctx.fillStyle = '#6b7280'
    ctx.font = '11px system-ui'
    ctx.textAlign = 'right'

    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (height / 4) * i
      const price = maxPrice - (priceRange / 4) * i
      ctx.fillText('$' + price.toFixed(0), paddingLeft - 10, y + 4)
    }
  }

  const drawPriceLine = (
    ctx: CanvasRenderingContext2D,
    stockData: StockDataPoint[],
    paddingLeft: number,
    paddingTop: number,
    width: number,
    height: number,
    minPrice: number,
    priceRange: number,
    isPositive: boolean,
  ) => {
    ctx.strokeStyle = isPositive ? '#10b981' : '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()

    stockData.forEach((point, index) => {
      const x = paddingLeft + (width / (stockData.length - 1)) * index
      const y = paddingTop + height - ((point.price - minPrice) / priceRange) * height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()
  }

  return {
    chartCanvas,
    drawChart,
  }
}
