import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { PortfolioService } from '@/services/portfolio'
import type { PortfolioStats, UserPortfolioData } from '@/types/portfolio'

export function usePortfolioData() {
  const authStore = useAuthStore()
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const portfolioData = ref<UserPortfolioData | null>(null)

  const portfolioStats = ref<PortfolioStats>({
    currentBalance: 0,
    totalInvested: 0,
    currentValue: 0,
    totalGrowth: 0,
    growthPercentage: 0,
  })

  let unsubscribe: (() => void) | null = null

  const fetchPortfolioData = async () => {
    if (!authStore.userId) {
      error.value = 'User not authenticated'
      isLoading.value = false
      return
    }

    try {
      unsubscribe = PortfolioService.subscribeToPortfolioData(authStore.userId, (userData) => {
        if (userData) {
          portfolioData.value = userData
          authStore.setUserName(userData.name)
          portfolioStats.value = PortfolioService.calculatePortfolioStats(userData)
          error.value = null
        } else {
          error.value = 'No portfolio data found'
        }
        isLoading.value = false
      })
    } catch (err) {
      console.error('Error fetching portfolio data:', err)
      error.value = 'Failed to load portfolio data'
      isLoading.value = false
    }
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
    }
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
