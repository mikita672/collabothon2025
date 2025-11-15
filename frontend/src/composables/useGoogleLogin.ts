import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useGoogleLogin() {
  const authStore = useAuthStore()
  const errorMessage = ref('')

  const handleGoogleLogin = async (onSuccess: () => void) => {
    errorMessage.value = ''

    if (typeof authStore.loginWithGoogle !== 'function') {
      errorMessage.value = 'Google login is not available. Please refresh the page.'
      return
    }

    const result = await authStore.loginWithGoogle()

    if (result.success) {
      onSuccess()
    } else {
      errorMessage.value = result.error || 'Google login failed'
    }
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  return {
    errorMessage,
    handleGoogleLogin,
    clearError,
    isLoading: () => authStore.loading,
  }
}
