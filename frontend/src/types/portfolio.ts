export interface Stock {
  ticker: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
  currentPrice?: number
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell'
  ticker: string
  quantity: number
  price: number
  date: string
  totalValue: number
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

export interface FirebaseUserData {
  balance: number
  invested: number
  name: string
  'risk-level'?: string
  stocks: Array<{
    ticker: string
    quantity: number
    purchacePrice: number
    purchaceDate: string
  }>
}

export interface TradeAction {
  type: 'buy' | 'sell'
  ticker: string
  quantity: number
  price: number
  total: number
}
