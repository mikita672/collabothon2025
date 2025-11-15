import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '@/services/firebase'
import { PortfolioService } from '@/services/portfolio'

export class AuthService {
  static async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      await PortfolioService.createUserPortfolio(userCredential.user.uid, email)

      return { success: true, user: userCredential.user }
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) }
    }
  }

  static async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) }
    }
  }

  static async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account',
      })
      const userCredential = await signInWithPopup(auth, provider)

      const existingData = await PortfolioService.getUserPortfolioData(userCredential.user.uid)
      if (!existingData) {
        await PortfolioService.createUserPortfolio(
          userCredential.user.uid,
          userCredential.user.email || 'user@example.com',
          userCredential.user.displayName || undefined,
        )
      }

      return { success: true, user: userCredential.user }
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) }
    }
  }

  static async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) }
    }
  }

  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  static getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/operation-not-allowed':
        return 'Operation not allowed'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/user-not-found':
        return 'No account found with this email'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/invalid-credential':
        return 'Invalid email or password'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later'
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed'
      case 'auth/cancelled-popup-request':
        return 'Sign-in cancelled'
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please enable popups'
      default:
        return 'An error occurred. Please try again'
    }
  }
}
