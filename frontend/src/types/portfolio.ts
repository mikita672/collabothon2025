export interface Stock {
  ticker: string
  quantity: number
  purchasePrice: number // Note: Firebase uses 'purchacePrice' (typo), mapping required
  purchaseDate: string // Note: Firebase uses 'purchaceDate' (typo), mapping required
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

// Firebase document structure (with typos in field names)
export interface FirebaseUserData {
  balance: number
  invested: number
  name: string
  'risk-level'?: string
  stocks: Array<{
    ticker: string
    quantity: number
    purchacePrice: number // typo in Firebase
    purchaceDate: string // typo in Firebase
  }>
}

export interface TradeAction {
  type: 'buy' | 'sell'
  ticker: string
  quantity: number
  price: number
  total: number
}
