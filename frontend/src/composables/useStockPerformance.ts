import { ref, watch, computed, type Ref } from 'vue'
import { fetchStockData } from '@/services/api'
import type { Stock, PerformanceData, DailyPerformance } from '@/types/portfolio'
import type { StockDataPoint } from '@/types/news'

export function useStockPerformance(stocks: Ref<Stock[]>) {
  const performanceData = ref<PerformanceData>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const convertToPerformanceData = (stockData: StockDataPoint[]): DailyPerformance[] => {
    const result: DailyPerformance[] = []
    
    for (let i = 0; i < stockData.length; i++) {
      const current = stockData[i]
      const previous = i > 0 ? stockData[i - 1] : current
      
      const open = previous.price
      const close = current.price
      const change = close - open
      const changePercent = open !== 0 ? (change / open) * 100 : 0

      result.push({
        date: current.date,
        open,
        close,
        change,
        changePercent,
      })
    }

    return result
  }

  const loadStockPerformance = async (ticker: string) => {
    try {
      const stockData = await fetchStockData(ticker)
      performanceData.value[ticker] = convertToPerformanceData(stockData)
    } catch (err) {
      console.error(`Error loading performance data for ${ticker}:`, err)
      performanceData.value[ticker] = []
    }
  }

  const loadAllPerformanceData = async () => {
    if (stocks.value.length === 0) {
      performanceData.value = {}
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // Load data for all stocks in parallel
      await Promise.all(
        stocks.value.map(stock => loadStockPerformance(stock.ticker))
      )
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load performance data'
      console.error('Error loading performance data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Watch for changes in stocks array
  watch(stocks, (newStocks, oldStocks) => {
    // Only reload if tickers have changed
    const newTickers = newStocks.map(s => s.ticker).sort().join(',')
    const oldTickers = oldStocks?.map(s => s.ticker).sort().join(',') || ''
    
    if (newTickers !== oldTickers) {
      loadAllPerformanceData()
    }
  }, { immediate: true, deep: true })

  return {
    performanceData,
    isLoading,
    error,
    loadAllPerformanceData,
  }
}
