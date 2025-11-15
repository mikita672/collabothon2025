export interface Stock {
  ticker: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
  currentPrice?: number
}

export interface PortfolioStats {
  currentBalance: number
  totalInvested: number
  currentValue: number
  totalGrowth: number
  growthPercentage: number
}

export interface UserPortfolioData {
  balance: number
  invested: number
  name: string
  risk_level?: string
  stocks: Stock[]
}

export interface TradeAction {
  type: 'buy' | 'sell'
  ticker: string
  quantity: number
  price: number
  total: number
}

export interface DailyPerformance {
  date: string
  open: number
  close: number
  change: number
  changePercent: number
}

export interface PerformanceData {
  [ticker: string]: DailyPerformance[]
}
