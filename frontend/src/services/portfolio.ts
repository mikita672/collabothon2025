import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import type { UserPortfolioData, PortfolioStats, Stock, Transaction, FirebaseUserData } from '@/types/portfolio'
import type { Holding } from '@/types/holding'

export class PortfolioService {
  // Helper method to map Firebase data (with typos) to our app structure
  private static mapFirebaseToUserData(firebaseData: any): UserPortfolioData {
    const stocks: Stock[] = Array.isArray(firebaseData.stocks) 
      ? firebaseData.stocks.map((stock: any) => ({
          ticker: stock.ticker,
          quantity: stock.quantity,
          purchasePrice: stock.purchacePrice || stock.purchasePrice || 0, // Handle typo
          purchaseDate: stock.purchaceDate || stock.purchaseDate || new Date().toISOString(), // Handle typo
        }))
      : []

    return {
      balance: firebaseData.balance || 0,
      invested: firebaseData.invested || 0,
      name: firebaseData.name || 'User',
      risk_level: firebaseData['risk-level'] || firebaseData.risk_level,
      stocks,
    }
  }

  static async createUserPortfolio(userId: string, email: string, name?: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId)

      const initialData: UserPortfolioData = {
        balance: 10000, // Starting balance: $10,000
        invested: 0,
        name: name ?? 'User',
        risk_level: undefined,
        stocks: [],
      }

      await setDoc(userDocRef, initialData)
      console.log('User portfolio created successfully')
    } catch (error) {
      console.error('Error creating user portfolio:', error)
      throw error
    }
  }

  static async migrateUserPortfolio(userId: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const data = userDoc.data()
        
        // Add stocks array if it doesn't exist
        if (!data.stocks || !Array.isArray(data.stocks)) {
          await updateDoc(userDocRef, {
            stocks: []
          })
          console.log('Portfolio migrated: added stocks array')
        }
      }
    } catch (error) {
      console.error('Error migrating user portfolio:', error)
    }
  }

  static async getUserPortfolioData(userId: string): Promise<UserPortfolioData | null> {
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const firebaseData = userDoc.data()
        return this.mapFirebaseToUserData(firebaseData)
      }

      return null
    } catch (error) {
      console.error('Error fetching user portfolio data:', error)
      throw error
    }
  }

  static async buyStock(
    userId: string,
    ticker: string,
    quantity: number,
    price: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        return { success: false, error: 'User portfolio not found' }
      }

      const userData = userDoc.data() as UserPortfolioData
      
      // Ensure stocks is an array
      if (!userData.stocks || !Array.isArray(userData.stocks)) {
        userData.stocks = []
      }
      
      const totalCost = quantity * price

      if (userData.balance < totalCost) {
        return { success: false, error: 'Insufficient balance' }
      }

      const existingStockIndex = userData.stocks.findIndex((s) => s.ticker === ticker)

      if (existingStockIndex !== -1) {
        // Update existing stock
        const existingStock = userData.stocks[existingStockIndex]
        if (existingStock) {
          const newTotalQuantity = existingStock.quantity + quantity
          const newAveragePrice =
            (existingStock.purchasePrice * existingStock.quantity + price * quantity) /
            newTotalQuantity

          userData.stocks[existingStockIndex] = {
            ticker: existingStock.ticker,
            purchaseDate: existingStock.purchaseDate,
            quantity: newTotalQuantity,
            purchasePrice: newAveragePrice,
          }
        }
      } else {
        // Add new stock
        const newStock: Stock = {
          ticker,
          quantity,
          purchasePrice: price,
          purchaseDate: new Date().toISOString(),
        }
        userData.stocks.push(newStock)
      }

      userData.balance -= totalCost
      userData.invested += totalCost

      await updateDoc(userDocRef, {
        balance: userData.balance,
        invested: userData.invested,
        stocks: userData.stocks,
      })

      return { success: true }
    } catch (error) {
      console.error('Error buying stock:', error)
      return { success: false, error: 'Failed to buy stock' }
    }
  }

  static async sellStock(
    userId: string,
    ticker: string,
    quantity: number,
    price: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        return { success: false, error: 'User portfolio not found' }
      }

      const userData = userDoc.data() as UserPortfolioData
      
      // Ensure stocks is an array
      if (!userData.stocks || !Array.isArray(userData.stocks)) {
        userData.stocks = []
      }
      
      const stockIndex = userData.stocks.findIndex((s) => s.ticker === ticker)

      if (stockIndex === -1) {
        return { success: false, error: 'Stock not found in portfolio' }
      }

      const stock = userData.stocks[stockIndex]

      if (!stock) {
        return { success: false, error: 'Stock not found in portfolio' }
      }

      if (stock.quantity < quantity) {
        return { success: false, error: 'Insufficient stock quantity' }
      }

      const totalRevenue = quantity * price
      const costBasis = stock.purchasePrice * quantity
      const profit = totalRevenue - costBasis

      if (stock.quantity === quantity) {
        // Remove stock completely
        userData.stocks.splice(stockIndex, 1)
      } else {
        // Reduce quantity
        const stockToUpdate = userData.stocks[stockIndex]
        if (stockToUpdate) {
          stockToUpdate.quantity -= quantity
        }
      }

      userData.balance += totalRevenue
      userData.invested -= costBasis

      await updateDoc(userDocRef, {
        balance: userData.balance,
        invested: userData.invested,
        stocks: userData.stocks,
      })

      return { success: true }
    } catch (error) {
      console.error('Error selling stock:', error)
      return { success: false, error: 'Failed to sell stock' }
    }
  }

  static calculatePortfolioStats(userData: UserPortfolioData): PortfolioStats {
    const currentBalance = userData.balance
    const totalInvested = userData.invested
    const currentValue = currentBalance + totalInvested
    const totalGrowth = currentBalance
    const growthPercentage = totalInvested > 0 ? (totalGrowth / totalInvested) * 100 : 0

    return {
      currentBalance,
      totalInvested,
      currentValue,
      totalGrowth,
      growthPercentage,
    }
  }

  static subscribeToPortfolioData(
    userId: string,
    callback: (data: UserPortfolioData | null) => void,
  ) {
    const userDocRef = doc(db, 'users', userId)

    return onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const firebaseData = docSnapshot.data()
          const mappedData = this.mapFirebaseToUserData(firebaseData)
          callback(mappedData)
        } else {
          callback(null)
        }
      },
      (error) => {
        console.error('Error subscribing to portfolio data:', error)
        callback(null)
      },
    )
  }

  // Convert stocks to transactions for history view
  static getTransactions(stocks: Stock[]): Transaction[] {
    return stocks.map((stock, index) => ({
      id: `${stock.ticker}-${stock.purchaseDate}-${index}`,
      type: 'buy' as const,
      ticker: stock.ticker,
      quantity: stock.quantity,
      price: stock.purchasePrice,
      date: stock.purchaseDate,
      totalValue: stock.quantity * stock.purchasePrice,
    }))
  }

  // Convert stocks to holdings for portfolio overview
  static async getHoldings(stocks: Stock[]): Promise<Holding[]> {
    // In a real app, you would fetch current prices from an API
    // For now, we'll use mock current prices
    return stocks.map((stock, index) => {
      const currentPrice = stock.purchasePrice * (1 + Math.random() * 0.2 - 0.1) // Mock: ±10% variation
      return {
        id: `${stock.ticker}-${index}`,
        name: this.getCompanyName(stock.ticker),
        ticker: stock.ticker,
        shares: stock.quantity,
        avgPrice: stock.purchasePrice,
        currentPrice,
        totalValue: stock.quantity * currentPrice,
      }
    })
  }

  // Helper to get company name from ticker (this should ideally come from an API)
  private static getCompanyName(ticker: string): string {
    const companyNames: Record<string, string> = {
      NVDA: 'NVIDIA Corporation',
      MSFT: 'Microsoft Corporation',
      AAPL: 'Apple Inc.',
      AMZN: 'Amazon.com Inc.',
      GOOGL: 'Alphabet Inc.',
      TSLA: 'Tesla Inc.',
      META: 'Meta Platforms Inc.',
      // Add more mappings as needed
    }
    return companyNames[ticker] || `${ticker} Corporation`
  }
}
