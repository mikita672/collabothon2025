import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PortfolioService } from '@/services/portfolio'
import { SimulationService } from '@/services/simulation'
import type { UserPortfolioData, PortfolioStats, Stock } from '@/types/portfolio'
import type { SimulationRequest, PortfolioSimulation } from '@/types/simulation'
import { useAuthStore } from './auth'

export const usePortfolioStore = defineStore('portfolio', () => {
  const authStore = useAuthStore()

  const portfolioData = ref<UserPortfolioData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const simulationData = ref<PortfolioSimulation | null>(null)
  const portfolioSeries = ref<number[]>([])
  const isSimulationActive = ref(false)
  const simulationTimer = ref<any>(null)
  const simulationStartTime = ref<Date | null>(null)
  const simulationStepCount = ref(0)
  const maxSimulationSteps = ref(390)

  const balance = computed(() => portfolioData.value?.balance || 0)
  const invested = computed(() => portfolioData.value?.invested || 0)
  const stocks = computed(() => portfolioData.value?.stocks || [])
  const userName = computed(() => portfolioData.value?.name || 'User')

  const currentStockPrices = computed(() => {
    if (!simulationData.value || !portfolioData.value) return new Map<string, number>()

    const priceMap = new Map<string, number>()
    simulationData.value.components.forEach((comp) => {
      priceMap.set(comp.symbol, comp.final_price)
    })
    return priceMap
  })

  const currentStocksValue = computed(() => {
    if (!portfolioData.value?.stocks) return 0

    return portfolioData.value.stocks.reduce((total, stock) => {
      const currentPrice = currentStockPrices.value.get(stock.ticker) || stock.purchasePrice
      return total + stock.quantity * currentPrice
    }, 0)
  })

  const totalStockGrowth = computed(() => {
    if (!portfolioData.value?.stocks) return 0

    return portfolioData.value.stocks.reduce((total, stock) => {
      const currentPrice = currentStockPrices.value.get(stock.ticker) || stock.purchasePrice
      const growth = (currentPrice - stock.purchasePrice) * stock.quantity
      return total + growth
    }, 0)
  })

  const stats = computed((): PortfolioStats | null => {
    if (!portfolioData.value) return null

    const currentBalance = portfolioData.value.balance

    const totalInvested = portfolioData.value.stocks.reduce((sum, stock) => {
      return sum + stock.quantity * stock.purchasePrice
    }, 0)

    const stocksValue = currentStocksValue.value
    const currentValue = currentBalance + stocksValue
    const totalGrowth = totalStockGrowth.value
    const growthPercentage = totalInvested > 0 ? (totalGrowth / totalInvested) * 100 : 0

    return {
      currentBalance,
      totalInvested,
      currentValue,
      totalGrowth,
      growthPercentage,
    }
  })

  let unsubscribe: (() => void) | null = null

  const loadPortfolio = async () => {
    if (!authStore.userId) {
      error.value = 'User not authenticated'
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await PortfolioService.getUserPortfolioData(authStore.userId)

      if (data && !Array.isArray(data.stocks)) {
        data.stocks = []
      }
      portfolioData.value = data
    } catch (err) {
      error.value = 'Failed to load portfolio'
    } finally {
      loading.value = false
    }
  }

  const subscribeToPortfolio = () => {
    if (!authStore.userId) return

    unsubscribe = PortfolioService.subscribeToPortfolioData(authStore.userId, (data) => {
      if (data && !Array.isArray(data.stocks)) {
        data.stocks = []
      }
      portfolioData.value = data
    })
  }

  const unsubscribeFromPortfolio = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  const buyStock = async (ticker: string, quantity: number, price: number) => {
    if (!authStore.userId) {
      return { success: false, error: 'User not authenticated' }
    }

    loading.value = true
    error.value = null

    const result = await PortfolioService.buyStock(authStore.userId, ticker, quantity, price)

    if (!result.success) {
      error.value = result.error || 'Failed to buy stock'
    }

    loading.value = false
    return result
  }

  const sellStock = async (ticker: string, quantity: number, price: number) => {
    if (!authStore.userId) {
      return { success: false, error: 'User not authenticated' }
    }

    loading.value = true
    error.value = null

    const result = await PortfolioService.sellStock(authStore.userId, ticker, quantity, price)

    if (!result.success) {
      error.value = result.error || 'Failed to sell stock'
    }

    loading.value = false
    return result
  }

  const getStockQuantity = (ticker: string): number => {
    if (!portfolioData.value || !Array.isArray(portfolioData.value.stocks)) {
      return 0
    }
    const stock = portfolioData.value.stocks.find((s) => s.ticker === ticker)
    return stock?.quantity || 0
  }

  const hasStock = (ticker: string): boolean => {
    return getStockQuantity(ticker) > 0
  }

  const startSimulation = async () => {
    if (isSimulationActive.value) {
      return
    }

    if (!portfolioData.value || portfolioData.value.stocks.length === 0) {
      return
    }

    try {
      isSimulationActive.value = true
      simulationStartTime.value = new Date()
      simulationStepCount.value = 0
      portfolioSeries.value = []

      const request = createSimulationRequest()

      portfolioSeries.value.push(request.portfolio_start)

      await updateSimulationStep(request)

      if (simulationTimer.value) clearInterval(simulationTimer.value)
      simulationTimer.value = setInterval(() => {
        if (simulationStepCount.value >= maxSimulationSteps.value) {
          stopSimulation()
          return
        }

        updateSimulationStep(request)
        simulationStepCount.value++
      }, 1000)
    } catch (err) {
      error.value = 'Failed to start price simulation'
      isSimulationActive.value = false
    }
  }

  const stopSimulation = () => {
    if (simulationTimer.value) {
      clearInterval(simulationTimer.value)
      simulationTimer.value = null
    }
    isSimulationActive.value = false
    simulationStartTime.value = null
  }

  const createSimulationRequest = (): SimulationRequest => {
    if (!portfolioData.value) throw new Error('No portfolio data')

    const stocks = portfolioData.value.stocks
    const investedValue = portfolioData.value.invested || 0

    const configs = stocks.map((stock) => ({
      symbol: stock.ticker,
      price: stock.purchasePrice,
      mu_daily: 0.0005,
      sigma_daily: 0.02,
      useStartP0: simulationData.value ? true : false,
      startP0: simulationData.value
        ? simulationData.value.components.find((c) => c.symbol === stock.ticker)?.final_price ||
          stock.purchasePrice
        : stock.purchasePrice,
      n_steps: 1,
      nu: 5,
      clip_limit: 0.05,
      seed: null,
      trend: 'standard' as const,
    }))

    const shares = stocks.map((stock) => stock.quantity)

    return {
      portfolio_start: investedValue,
      count: stocks.length,
      configs,
      shares,
    }
  }

  const updateSimulationStep = async (baseRequest: SimulationRequest) => {
    try {
      const request = { ...baseRequest }

      if (simulationData.value) {
        request.configs = request.configs.map((config, index) => {
          const component = simulationData.value?.components[index]
          return {
            ...config,
            useStartP0: true,
            startP0: component?.final_price || config.price,
            seed: config.seed || Math.floor(Math.random() * 1000000),
          }
        })
      } else {
        request.configs = request.configs.map((config) => ({
          ...config,
          seed: Math.floor(Math.random() * 1000000),
        }))
      }

      const newData = await SimulationService.simulatePortfolio(request)
      simulationData.value = newData

      if (newData.portfolio_final_value && portfolioSeries.value.length > 0) {
        portfolioSeries.value.push(newData.portfolio_final_value)
      }
    } catch (err) {
      console.error('Failed to update simulation step:', err)
    }
  }

  const getStockCurrentPrice = (ticker: string): number => {
    return (
      currentStockPrices.value.get(ticker) ||
      portfolioData.value?.stocks.find((s) => s.ticker === ticker)?.purchasePrice ||
      0
    )
  }

  return {
    portfolioData,
    loading,
    error,
    balance,
    invested,
    stocks,
    userName,
    stats,
    simulationData,
    portfolioSeries,
    isSimulationActive,
    currentStockPrices,
    currentStocksValue,
    totalStockGrowth,
    loadPortfolio,
    subscribeToPortfolio,
    unsubscribeFromPortfolio,
    buyStock,
    sellStock,
    getStockQuantity,
    hasStock,
    startSimulation,
    stopSimulation,
    getStockCurrentPrice,
    simulationStepCount,
    maxSimulationSteps,
  }
})
