import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function useRegistration() {
  const authStore = useAuthStore();
  
  const formRef = ref();
  const isFormValid = ref(false);
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const showSuccessSnackbar = ref(false);
  const errorMessage = ref('');

  const formData = ref({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const rules = {
    required: (value: string) => !!value || 'This field is required',
    minLength: (min: number) => (value: string) =>
      (value && value.length >= min) || `Must be at least ${min} characters`,
    email: (value: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) || 'Invalid email address';
    },
    passwordMatch: (value: string) =>
      value === formData.value.password || 'Passwords do not match',
  };

  const handleRegister = async (onSuccess: () => void) => {
    const { valid } = await formRef.value.validate();
    
    if (!valid) return;

    errorMessage.value = '';
    
    const result = await authStore.register(formData.value.email, formData.value.password);
    
    if (result.success) {
      showSuccessSnackbar.value = true;
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      errorMessage.value = result.error || 'Registration failed';
    }
  };

  const clearError = () => {
    errorMessage.value = '';
  };

  return {
    formRef,
    isFormValid,
    showPassword,
    showConfirmPassword,
    showSuccessSnackbar,
    errorMessage,
    formData,
    rules,
    handleRegister,
    clearError,
    isLoading: () => authStore.loading
  };
}
