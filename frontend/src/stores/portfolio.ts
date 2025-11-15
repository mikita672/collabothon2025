import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PortfolioService } from '@/services/portfolio'
import type { UserPortfolioData, PortfolioStats } from '@/types/portfolio'
import { useAuthStore } from './auth'

export const usePortfolioStore = defineStore('portfolio', () => {
  const authStore = useAuthStore()
  
  const portfolioData = ref<UserPortfolioData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const balance = computed(() => portfolioData.value?.balance || 0)
  const invested = computed(() => portfolioData.value?.invested || 0)
  const stocks = computed(() => portfolioData.value?.stocks || [])
  const userName = computed(() => portfolioData.value?.name || 'User')

  const stats = computed((): PortfolioStats | null => {
    if (!portfolioData.value) return null
    return PortfolioService.calculatePortfolioStats(portfolioData.value)
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
      // Ensure stocks is always an array
      if (data && !Array.isArray(data.stocks)) {
        data.stocks = []
      }
      portfolioData.value = data
    } catch (err) {
      error.value = 'Failed to load portfolio'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const subscribeToPortfolio = () => {
    if (!authStore.userId) return

    unsubscribe = PortfolioService.subscribeToPortfolioData(authStore.userId, (data) => {
      // Ensure stocks is always an array
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

  return {
    portfolioData,
    loading,
    error,
    balance,
    invested,
    stocks,
    userName,
    stats,
    loadPortfolio,
    subscribeToPortfolio,
    unsubscribeFromPortfolio,
    buyStock,
    sellStock,
    getStockQuantity,
    hasStock,
  }
})
