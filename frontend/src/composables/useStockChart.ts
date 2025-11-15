import { ref, watch, onUnmounted, type Ref } from 'vue'
import type { NewsItem, StockDataPoint } from '@/types/news'
import { useChartDrawing } from './useChartDrawing'

export function useStockChart(
  news: Ref<NewsItem | null>,
  stockData: Ref<StockDataPoint[]>,
  isPositive: Ref<boolean>
) {
  const { chartCanvas, drawChart } = useChartDrawing()
  let chartInstance: any = null

  // Redraw chart on news change
  watch(
    news,
    (newNews) => {
      if (newNews && chartCanvas.value && stockData.value.length > 0) {
        drawChart(chartCanvas.value, stockData.value, isPositive.value)
      }
    },
    { immediate: true }
  )

  // Redraw chart on data change
  watch(
    stockData,
    (newData) => {
      if (news.value && chartCanvas.value && newData.length > 0) {
        drawChart(chartCanvas.value, newData, isPositive.value)
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (chartInstance) {
      chartInstance = null
    }
  })

  return {
    chartCanvas,
  }
}
