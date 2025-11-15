import { computed, watch, onUnmounted } from 'vue'
import { useSimulationStore } from '@/stores/simulation'
import { usePortfolioData } from '@/composables/usePortfolioData'

export function usePortfolioSimulation() {
  const simulationStore = useSimulationStore()
  const { portfolioStats, isLoading: isPortfolioLoading } = usePortfolioData()

  watch(
    () => portfolioStats.value.totalInvested,
    async (totalInvested) => {
      if (totalInvested > 0 && !simulationStore.loading && !simulationStore.simulationData) {
        await simulationStore.fetchSimulation(totalInvested)
        simulationStore.startRealtimeUpdates()
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    simulationStore.stopRealtimeUpdates()
  })

  const isLoading = computed(() => isPortfolioLoading.value || simulationStore.loading)
  const error = computed(() => simulationStore.error)

  return {
    simulationData: computed(() => simulationStore.simulationData),
    chartData: computed(() => simulationStore.chartData),
    portfolioSeries: computed(() => simulationStore.portfolioSeries),
    portfolioFinalValue: computed(() => simulationStore.portfolioFinalValue),
    portfolioChangeRate: computed(() => simulationStore.portfolioChangeRate),
    components: computed(() => simulationStore.components),

    isLoading,
    error,
    isStreaming: computed(() => simulationStore.isStreaming),
    isUpdating: computed(() => simulationStore.isUpdating),

    fetchSimulation: simulationStore.fetchSimulation,
    updateSimulation: simulationStore.updateSimulation,
    startRealtimeUpdates: simulationStore.startRealtimeUpdates,
    stopRealtimeUpdates: simulationStore.stopRealtimeUpdates,
  }
}
