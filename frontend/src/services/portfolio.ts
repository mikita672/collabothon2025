import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import type { UserPortfolioData, PortfolioStats } from '@/types/portfolio'

export class PortfolioService {
  /**
   * Fetch user portfolio data from Firestore
   * @param userId - The user's UID
   * @returns UserPortfolioData or null if not found
   */
  static async getUserPortfolioData(userId: string): Promise<UserPortfolioData | null> {
    try {
      const userDocRef = doc(db, userId, 'portfolio')
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

  /**
   * Calculate portfolio stats from user data
   * @param userData - User portfolio data from Firebase
   * @returns Calculated PortfolioStats
   */
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
      growthPercentage
    }
  }

  /**
   * Subscribe to real-time updates of user portfolio data
   * @param userId - The user's UID
   * @param callback - Callback function to handle data updates
   * @returns Unsubscribe function
   */
  static subscribeToPortfolioData(
    userId: string,
    callback: (data: UserPortfolioData | null) => void
  ) {
    const userDocRef = doc(db, userId, 'portfolio')
    
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
      }
    )
  }
}
