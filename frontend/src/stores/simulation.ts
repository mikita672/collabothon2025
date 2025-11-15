import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SimulationService } from '@/services/simulation'
import type { PortfolioSimulation, SimulationRequest } from '@/types/simulation'

export const useSimulationStore = defineStore('simulation', () => {
  const simulationData = ref<PortfolioSimulation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const portfolioSeries = computed(() => simulationData.value?.portfolio_series || [])
  const portfolioStart = computed(() => simulationData.value?.portfolio_start || 0)
  const portfolioFinalValue = computed(() => simulationData.value?.portfolio_final_value || 0)
  const portfolioChangeRate = computed(() => simulationData.value?.portfolio_change_rate || 0)
  const components = computed(() => simulationData.value?.components || [])

  const chartData = computed(() => {
    if (!simulationData.value || simulationData.value.portfolio_series.length === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    const labels = simulationData.value.portfolio_series.map((_, index) => {
      if (index % 10 === 0) {
        return `T${index}`
      }
      return ''
    })

    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          borderColor: '#FFD501',
          data: simulationData.value.portfolio_series,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#42A5F5',
        },
      ],
    }
  })

  const fetchSimulation = async (
    portfolioStart: number,
    customRequest?: Partial<SimulationRequest>,
  ) => {
    loading.value = true
    error.value = null

    try {
      const request = customRequest
        ? { ...SimulationService.createDefaultRequest(portfolioStart), ...customRequest }
        : SimulationService.createDefaultRequest(portfolioStart)

      const data = await SimulationService.simulatePortfolio(request)
      simulationData.value = data
    } catch (err) {
      console.error('Error fetching simulation:', err)
      error.value = 'Failed to load portfolio simulation'
    } finally {
      loading.value = false
    }
  }

  const updateSimulation = async (request: SimulationRequest) => {
    loading.value = true
    error.value = null

    try {
      const data = await SimulationService.simulatePortfolio(request)
      simulationData.value = data
    } catch (err) {
      console.error('Error updating simulation:', err)
      error.value = 'Failed to update portfolio simulation'
    } finally {
      loading.value = false
    }
  }

  const clearSimulation = () => {
    simulationData.value = null
    error.value = null
  }

  return {
    simulationData,
    loading,
    error,

    portfolioSeries,
    portfolioStart,
    portfolioFinalValue,
    portfolioChangeRate,
    components,
    chartData,

    fetchSimulation,
    updateSimulation,
    clearSimulation,
  }
})
