import { computed, onMounted, onUnmounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'

export function usePortfolioData() {
  const portfolioStore = usePortfolioStore()
  const authStore = useAuthStore()

  const portfolioData = computed(() => portfolioStore.portfolioData)
  const portfolioStats = computed(
    () =>
      portfolioStore.stats || {
        currentBalance: 0,
        totalInvested: 0,
        currentValue: 0,
        totalGrowth: 0,
        growthPercentage: 0,
      },
  )

  const isLoading = computed(() => portfolioStore.loading)
  const error = computed(() => portfolioStore.error)

  const fetchPortfolioData = async () => {
    if (!authStore.userId) {
      return
    }

    try {
      portfolioStore.subscribeToPortfolio()

      setTimeout(() => {
        if (portfolioStore.stocks.length > 0) {
          portfolioStore.startSimulation()
        }
      }, 1000)
    } catch (err) {
      console.error('Error fetching portfolio data:', err)
    }
  }

  const cleanup = () => {
    portfolioStore.unsubscribeFromPortfolio()
    portfolioStore.stopSimulation()
  }

  onMounted(() => {
    fetchPortfolioData()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    portfolioData,
    portfolioStats,
    isLoading,
    error,
    fetchPortfolioData,
    cleanup,
  }
}
