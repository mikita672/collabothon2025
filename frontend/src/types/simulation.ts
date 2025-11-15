// Portfolio simulation types for FastAPI integration

export interface SimulationConfig {
  symbol: string
  price: number
  mu_daily: number
  sigma_daily: number
  useStartP0: boolean
  startP0: number
  n_steps: number
  nu: number
  clip_limit: number
  seed: number | null
  trend: 'standard' | 'bullish' | 'bearish'
}

export interface SimulationRequest {
  portfolio_start: number
  count: number
  configs: SimulationConfig[]
  shares: number[]
}

export interface ComponentData {
  prices: number[]
  final_price: number
  change_rate: number
  symbol: string
  shares: number
}

export interface PortfolioSimulation {
  portfolio_start: number
  portfolio_final_value: number
  portfolio_change_rate: number
  portfolio_series: number[]
  components: ComponentData[]
}
