import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type User } from 'firebase/auth'
import { AuthService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const userName = ref<string>('')

  const isLoggedIn = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userId = computed(() => user.value?.uid || '')

  const initializeAuth = () => {
    return new Promise((resolve) => {
      AuthService.onAuthStateChanged((firebaseUser) => {
        user.value = firebaseUser
        resolve(firebaseUser)
      })
    })
  }

  const register = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    const result = await AuthService.register(email, password)

    if (result.success) {
      user.value = result.user!
    } else {
      error.value = result.error!
    }

    loading.value = false
    return result
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    const result = await AuthService.login(email, password)

    if (result.success) {
      user.value = result.user!
    } else {
      error.value = result.error!
    }

    loading.value = false
    return result
  }

  const loginWithGoogle = async () => {
    loading.value = true
    error.value = null

    const result = await AuthService.loginWithGoogle()

    if (result.success) {
      user.value = result.user!
    } else {
      error.value = result.error!
    }

    loading.value = false
    return result
  }

  // Login with Firebase token (для QR аутентификации)
  const loginWithToken = async (token: string) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await AuthService.loginWithToken(token)
      
      if (result.success) {
        user.value = result.user!
      } else {
        error.value = result.error!
      }
      
      loading.value = false
      return result
    } catch (err) {
      error.value = 'Token authentication failed'
      loading.value = false
      return { success: false, error: 'Token authentication failed' }
    }
  }

  // Logout user
  const logout = async () => {
    loading.value = true
    error.value = null

    const result = await AuthService.logout()

    if (result.success) {
      user.value = null
    } else {
      error.value = result.error!
    }

    loading.value = false
    return result
  }

  const clearError = () => {
    error.value = null
  }

  const setUserName = (name: string) => {
    userName.value = name
  }

  return {
    user,
    loading,
    error,
    userName,
    isLoggedIn,
    userEmail,
    userId,
    initializeAuth,
    register,
    login,
    loginWithGoogle,
    loginWithToken,
    logout,
    clearError,
    setUserName,
  }
})
