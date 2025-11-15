import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import type { UserPortfolioData, PortfolioStats } from '@/types/portfolio'

export class PortfolioService {
  static async createUserPortfolio(userId: string, email: string, name?: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId)

      const initialData: UserPortfolioData = {
        balance: 0,
        invested: 0,
        name: name ?? 'skebob',
        risk_level: undefined,
      }

      await setDoc(userDocRef, initialData)
      console.log('User portfolio created successfully')
    } catch (error) {
      console.error('Error creating user portfolio:', error)
      throw error
    }
  }

  static async getUserPortfolioData(userId: string): Promise<UserPortfolioData | null> {
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const data = userDoc.data() as UserPortfolioData
        return data
      }

      return null
    } catch (error) {
      console.error('Error fetching user portfolio data:', error)
      throw error
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
          callback(docSnapshot.data() as UserPortfolioData)
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
}
