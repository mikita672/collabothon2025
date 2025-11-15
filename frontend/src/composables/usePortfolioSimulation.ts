import { computed, watch } from 'vue'
import { useSimulationStore } from '@/stores/simulation'
import { usePortfolioData } from '@/composables/usePortfolioData'

export function usePortfolioSimulation() {
  const simulationStore = useSimulationStore()
  const { portfolioStats, isLoading: isPortfolioLoading } = usePortfolioData()

  watch(
    () => portfolioStats.value.totalInvested,
    (totalInvested) => {
      if (totalInvested > 0 && !simulationStore.loading) {
        simulationStore.fetchSimulation(totalInvested)
      }
    },
    { immediate: true },
  )

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

    fetchSimulation: simulationStore.fetchSimulation,
    updateSimulation: simulationStore.updateSimulation,
  }
}
