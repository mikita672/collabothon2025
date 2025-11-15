import type { SimulationRequest, PortfolioSimulation } from '@/types/simulation'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class SimulationService {
  static async simulatePortfolio(request: SimulationRequest): Promise<PortfolioSimulation> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate_portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data as PortfolioSimulation
    } catch (error) {
      console.error('Error simulating portfolio:', error)
      throw error
    }
  }

  static createDefaultRequest(portfolioStart: number): SimulationRequest {
    return {
      portfolio_start: portfolioStart,
      count: 1,
      configs: [
        {
          symbol: 'AMZN',
          price: 100,
          mu_daily: 0.0005,
          sigma_daily: 0.02,
          useStartP0: false,
          startP0: 100,
          n_steps: 390,
          nu: 5,
          clip_limit: 0.05,
          seed: null,
          trend: 'standard',
        },
      ],
      shares: [2],
    }
  }
}
