import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import type { UserPortfolioData, PortfolioStats, Stock, PerformanceData } from '@/types/portfolio'

export class PortfolioService {
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
        const data = userDoc.data() as UserPortfolioData
        
        // Ensure stocks is always an array
        if (!data.stocks || !Array.isArray(data.stocks)) {
          data.stocks = []
        }
        
        return data
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
        const newTotalQuantity = existingStock.quantity + quantity
        const newAveragePrice =
          (existingStock.purchasePrice * existingStock.quantity + price * quantity) /
          newTotalQuantity

        userData.stocks[existingStockIndex] = {
          ...existingStock,
          quantity: newTotalQuantity,
          purchasePrice: newAveragePrice,
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
        userData.stocks[stockIndex].quantity -= quantity
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
          const data = docSnapshot.data() as UserPortfolioData
          
          // Ensure stocks is always an array
          if (!data.stocks || !Array.isArray(data.stocks)) {
            data.stocks = []
          }
          
          callback(data)
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

  static async updatePerformanceData(
    userId: string,
    performanceData: PerformanceData
  ): Promise<void> {
    try {
      const performanceDocRef = doc(db, 'performance', userId)
      await setDoc(performanceDocRef, performanceData, { merge: true })
      console.log('Performance data updated successfully')
    } catch (error) {
      console.error('Error updating performance data:', error)
      throw error
    }
  }

  static async getPerformanceData(userId: string): Promise<PerformanceData | null> {
    try {
      const performanceDocRef = doc(db, 'performance', userId)
      const performanceDoc = await getDoc(performanceDocRef)

      if (performanceDoc.exists()) {
        return performanceDoc.data() as PerformanceData
      }

      return null
    } catch (error) {
      console.error('Error fetching performance data:', error)
      throw error
    }
  }
}
