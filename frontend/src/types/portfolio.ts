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
}
