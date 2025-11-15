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

  // Initialize auth state listener
  const initializeAuth = () => {
    return new Promise((resolve) => {
      AuthService.onAuthStateChanged((firebaseUser) => {
        user.value = firebaseUser
        resolve(firebaseUser)
      })
    })
  }

  // Register new user
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

  // Login user
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

  // Login with Google
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

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Set user name
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
    logout,
    clearError,
    setUserName
  }
})
