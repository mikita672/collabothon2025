import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SimulationService } from '@/services/simulation'
import type { PortfolioSimulation, SimulationRequest } from '@/types/simulation'

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export const useSimulationStore = defineStore('simulation', () => {
  const simulationData = ref<PortfolioSimulation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentRequest = ref<SimulationRequest | null>(null)
  const isStreaming = ref(false)
  const isUpdating = ref(false)
  const timerId = ref<any>(null)

  const chartWindowSize = ref(390)
  const currentTotalSteps = ref(390)

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

    const startMinute = currentTotalSteps.value - chartWindowSize.value

    const baseTime = new Date()
    baseTime.setHours(9, 30, 0, 0)

    const windowStartTime = new Date(baseTime.getTime() + startMinute * 60000)

    const labels = simulationData.value.portfolio_series.map((_, index) => {
      const currentTime = new Date(windowStartTime.getTime() + index * 60000)
      const minutes = currentTime.getMinutes()

      if (minutes === 0 || minutes === 30) {
        return formatTime(currentTime)
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
    portfolioStartValue: number,
    customRequest?: Partial<SimulationRequest>,
  ) => {
    loading.value = true
    error.value = null
    stopRealtimeUpdates()

    try {
      const request = customRequest
        ? { ...SimulationService.createDefaultRequest(portfolioStartValue), ...customRequest }
        : SimulationService.createDefaultRequest(portfolioStartValue)

      request.configs.forEach((config) => {
        if (config.seed === null) {
          config.seed = Math.floor(Math.random() * 1000000)
        }
      })

      const steps = request.configs[0]?.n_steps || 390
      chartWindowSize.value = steps
      currentTotalSteps.value = steps

      currentRequest.value = request
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
    stopRealtimeUpdates()

    try {
      request.configs.forEach((config) => {
        if (config.seed === null) {
          config.seed = Math.floor(Math.random() * 1000000)
        }
      })

      const steps = request.configs[0]?.n_steps || 390
      chartWindowSize.value = steps
      currentTotalSteps.value = steps

      currentRequest.value = request
      const data = await SimulationService.simulatePortfolio(request)
      simulationData.value = data
    } catch (err) {
      console.error('Error updating simulation:', err)
      error.value = 'Failed to update portfolio simulation'
    } finally {
      loading.value = false
    }
  }

  const _fetchNextSteps = async () => {
    if (isUpdating.value || !currentRequest.value || !simulationData.value) {
      return
    }

    isUpdating.value = true
    error.value = null

    try {
      const newTotalSteps = currentTotalSteps.value + 5

      const newConfigs = currentRequest.value.configs.map((config) => {
        return {
          ...config,
          n_steps: newTotalSteps,
          useStartP0: false,
          startP0: config.price,
          seed: config.seed,
        }
      })

      const nextRequest: SimulationRequest = {
        ...currentRequest.value,
        portfolio_start: currentRequest.value.portfolio_start,
        configs: newConfigs,
      }

      const newData = await SimulationService.simulatePortfolio(nextRequest)

      if (simulationData.value) {
        const newSeries = newData.portfolio_series.slice(-chartWindowSize.value)
        simulationData.value.portfolio_series = newSeries

        simulationData.value.components = simulationData.value.components.map((comp, index) => {
          const newPrices = newData.components[index]?.prices.slice(-chartWindowSize.value) || []
          return {
            ...comp,
            prices: newPrices,
            final_price: newData.components[index]?.final_price || comp.final_price,
            change_rate: newData.components[index]?.change_rate || comp.change_rate,
          }
        })

        simulationData.value.portfolio_final_value = newData.portfolio_final_value
        simulationData.value.portfolio_start = newSeries[0] ?? 0
        simulationData.value.portfolio_change_rate =
          simulationData.value.portfolio_final_value / simulationData.value.portfolio_start - 1

        currentTotalSteps.value = newTotalSteps
      }
    } catch (err) {
      console.error('Error fetching next simulation steps:', err)
      error.value = 'Failed to update simulation'
      stopRealtimeUpdates()
    } finally {
      isUpdating.value = false
    }
  }

  const startRealtimeUpdates = () => {
    if (isStreaming.value || timerId.value) {
      return
    }

    console.log('Starting real-time simulation updates...')
    isStreaming.value = true
    if (timerId.value) window.clearInterval(timerId.value)

    timerId.value = window.setInterval(async () => {
      await _fetchNextSteps()
    }, 5000)
  }

  const stopRealtimeUpdates = () => {
    if (!timerId.value) {
      return
    }

    console.log('Stopping real-time simulation updates.')
    window.clearInterval(timerId.value)
    timerId.value = null
    isStreaming.value = false
    isUpdating.value = false
  }

  const clearSimulation = () => {
    stopRealtimeUpdates()
    simulationData.value = null
    currentRequest.value = null
    error.value = null
  }

  return {
    simulationData,
    loading,
    error,
    isStreaming,
    isUpdating,

    portfolioSeries,
    portfolioStart,
    portfolioFinalValue,
    portfolioChangeRate,
    components,
    chartData,

    fetchSimulation,
    updateSimulation,
    clearSimulation,
    startRealtimeUpdates,
    stopRealtimeUpdates,
  }
})
