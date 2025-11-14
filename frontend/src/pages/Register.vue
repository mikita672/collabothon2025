<template>
  <v-container fluid class="fill-height gradient-background">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 login-card">
          <v-card-text class="pa-4">
            <div class="d-flex flex-column align-center">
              <!-- Title -->
              <h1 class="text-h6 text-center mb-1">Create Account</h1>
              <p class="text-caption text-center text-grey-darken-1 mb-3">
                Join CommerzBank
              </p>

              <!-- Registration Form -->
              <div class="w-100 button-container">
                <!-- Google Sign Up -->
                <v-btn
                  @click="handleGoogleSignUp"
                  :loading="authStore.loading"
                  :disabled="authStore.loading"
                  variant="outlined"
                  size="small"
                  block
                  class="mb-2 text-none google-button"
                  height="40"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" class="mr-2">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Continue with Google
                </v-btn>

                <!-- Google Error Alert -->
                <v-alert
                  v-if="googleErrorMessage"
                  type="error"
                  variant="tonal"
                  density="compact"
                  class="mb-2"
                  closable
                  @click:close="clearGoogleError"
                >
                  {{ googleErrorMessage }}
                </v-alert>

                <div class="divider-container my-3">
                  <v-divider></v-divider>
                  <span class="divider-text">or</span>
                  <v-divider></v-divider>
                </div>

                <v-form ref="formRef" v-model="isFormValid" class="w-100">
                  <!-- Email -->
                  <v-text-field
                    v-model="formData.email"
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    class="mb-2"
                    density="compact"
                  />

                  <!-- Password -->
                  <v-text-field
                    v-model="formData.password"
                    label="Password"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="[rules.required, rules.minLength(8)]"
                    class="mb-2"
                    density="compact"
                    @click:append-inner="showPassword = !showPassword"
                  />

                  <!-- Confirm Password -->
                  <v-text-field
                    v-model="formData.confirmPassword"
                    label="Confirm Password"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="[rules.required, rules.passwordMatch]"
                    class="mb-3"
                    density="compact"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  />

                  <!-- Register Button -->
                  <v-btn
                    @click="handleRegister"
                    :disabled="!isFormValid || authStore.loading"
                    :loading="authStore.loading"
                    size="small"
                    block
                    class="mb-2 gradient-button text-none"
                    height="40"
                  >
                    <v-icon class="mr-1" size="18">mdi-account-plus</v-icon>
                    Create Account
                  </v-btn>

                  <!-- Error Alert -->
                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mb-2"
                    closable
                    @click:close="errorMessage = ''"
                  >
                    {{ errorMessage }}
                  </v-alert>
                </v-form>

                <!-- Login Link -->
                <div class="text-center mt-3">
                  <p class="text-body-2 text-grey-darken-1">
                    Already have an account?
                    <a href="#" class="text-primary font-weight-medium" @click.prevent="goToLogin">
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      :timeout="3000"
      location="top"
    >
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      Account created successfully!
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRegistration } from '@/composables/useRegistration';
import { useGoogleLogin } from '@/composables/useGoogleLogin';

const authStore = useAuthStore();

const emit = defineEmits<{
  register: [];
  'go-to-login': [];
}>();

const {
  formRef,
  isFormValid,
  showPassword,
  showConfirmPassword,
  showSuccessSnackbar,
  errorMessage,
  formData,
  rules,
  handleRegister: performRegister,
  clearError
} = useRegistration();

// Google login (also works for registration)
const {
  errorMessage: googleErrorMessage,
  handleGoogleLogin: performGoogleLogin,
  clearError: clearGoogleError
} = useGoogleLogin();

const handleRegister = async () => {
  await performRegister(() => emit('register'));
};

const handleGoogleSignUp = async () => {
  await performGoogleLogin(() => emit('register'));
};

const goToLogin = () => {
  emit('go-to-login');
};
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 50%, #f3e8ff 100%);
  min-height: 100vh;
  padding: 0.5rem 0;
  overflow: hidden;
}

.login-card {
  border-radius: 16px !important;
  overflow: visible;
}

.gradient-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.gradient-button {
  background: linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%) !important;
  color: white !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25) !important;
  transition: all 0.3s ease !important;
}

.gradient-button:hover:not(:disabled) {
  background: linear-gradient(90deg, #2563eb 0%, #4338ca 100%) !important;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35) !important;
  transform: translateY(-2px);
}

.gradient-button:disabled {
  opacity: 0.7 !important;
}

.button-container {
  width: 100%;
}

.button-container .v-btn {
  border-radius: 10px !important;
}

.security-alert {
  border-radius: 10px !important;
  background: rgba(33, 150, 243, 0.08) !important;
}

.w-100 {
  width: 100%;
}

.text-none {
  text-transform: none !important;
}

.google-button {
  border: 1.5px solid #dadce0 !important;
  color: #3c4043 !important;
  background-color: white !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}

.google-button:hover {
  background-color: #f8f9fa !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
  border-color: #c6c6c6 !important;
}

.divider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.divider-text {
  color: #9e9e9e;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

:deep(.v-field--variant-outlined) {
  border-radius: 10px !important;
}
</style>
