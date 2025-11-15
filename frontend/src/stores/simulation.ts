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

  const TOTAL_MARKET_MINUTES = 390
  const STEPS_PER_UPDATE = 1

  const portfolioSeries = computed(() => simulationData.value?.portfolio_series || [])
  const portfolioStart = computed(() => simulationData.value?.portfolio_start || 0)
  const portfolioFinalValue = computed(() => simulationData.value?.portfolio_final_value || 0)
  const portfolioChangeRate = computed(() => simulationData.value?.portfolio_change_rate || 0)
  const components = computed(() => simulationData.value?.components || [])

  const chartData = computed(() => {
    const baseTime = new Date()
    baseTime.setHours(9, 30, 0, 0)

    const labels = Array.from({ length: TOTAL_MARKET_MINUTES }, (_, index) => {
      const currentTime = new Date(baseTime.getTime() + index * 60000)
      const minutes = currentTime.getMinutes()

      if (minutes === 0 || minutes === 30) {
        return formatTime(currentTime)
      }
      return ''
    })

    const dataLength = simulationData.value?.portfolio_series.length || 0
    const chartDataArray = Array.from({ length: TOTAL_MARKET_MINUTES }, (_, index) => {
      if (index < dataLength) {
        return simulationData.value?.portfolio_series[index] ?? null
      }
      return null
    })

    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          borderColor: '#FFD501',
          data: chartDataArray,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#42A5F5',
          spanGaps: false,
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
        config.n_steps = STEPS_PER_UPDATE
      })

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
        config.n_steps = STEPS_PER_UPDATE
      })

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

    const currentDataLength = simulationData.value.portfolio_series.length

    if (currentDataLength >= TOTAL_MARKET_MINUTES) {
      console.log('Market hours complete, stopping updates')
      stopRealtimeUpdates()
      return
    }

    isUpdating.value = true
    error.value = null

    try {
      const newTotalSteps = currentDataLength + STEPS_PER_UPDATE

      const newConfigs = currentRequest.value.configs.map((config, index) => {
        const lastPrice = simulationData.value?.components[index]?.final_price || config.price
        return {
          ...config,
          n_steps: newTotalSteps,
          useStartP0: true,
          startP0: lastPrice,
          seed: config.seed,
        }
      })

      const nextRequest: SimulationRequest = {
        ...currentRequest.value,
        portfolio_start:
          simulationData.value.portfolio_series[0] || simulationData.value.portfolio_start,
        configs: newConfigs,
      }

      const newData = await SimulationService.simulatePortfolio(nextRequest)

      if (simulationData.value) {
        const newPoints = newData.portfolio_series.slice(-STEPS_PER_UPDATE)
        simulationData.value.portfolio_series.push(...newPoints)

        simulationData.value.components = simulationData.value.components.map((comp, index) => {
          const newPrices = newData.components[index]?.prices.slice(-STEPS_PER_UPDATE) || []
          return {
            ...comp,
            prices: [...comp.prices, ...newPrices],
            final_price: newData.components[index]?.final_price || comp.final_price,
            change_rate: newData.components[index]?.change_rate || comp.change_rate,
          }
        })

        simulationData.value.portfolio_final_value = newData.portfolio_final_value
        simulationData.value.portfolio_change_rate =
          (simulationData.value.portfolio_final_value - simulationData.value.portfolio_start) /
          simulationData.value.portfolio_start
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
    }, 1000)
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
