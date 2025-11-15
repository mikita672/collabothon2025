import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function useEmailLogin() {
  const authStore = useAuthStore();
  
  const loginEmail = ref('');
  const loginPassword = ref('');
  const showPassword = ref(false);
  const errorMessage = ref('');

  const handleEmailLogin = async (onSuccess: () => void) => {
    if (!loginEmail.value || !loginPassword.value) {
      errorMessage.value = 'Please enter email and password';
      return;
    }

    errorMessage.value = '';
    
    const result = await authStore.login(loginEmail.value, loginPassword.value);
    
    if (result.success) {
      onSuccess();
    } else {
      errorMessage.value = result.error || 'Login failed';
    }
  };

  const clearError = () => {
    errorMessage.value = '';
  };

  return {
    loginEmail,
    loginPassword,
    showPassword,
    errorMessage,
    handleEmailLogin,
    clearError,
    isLoading: () => authStore.loading
  };
}
