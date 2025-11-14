<template>
  <v-container fluid class="fill-height gradient-background">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 login-card">
          <v-card-text class="pa-4">
            <div class="d-flex flex-column align-center">
              <!-- Title -->
              <h1 class="text-h6 text-center mb-1" color="#002e3d">Create Account</h1>
              <p class="text-caption text-center text-grey-darken-1 mb-3">
                Join CommerzBank
              </p>

              <!-- Registration Form -->
              <div class="w-100 button-container">

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

                <div class="divider-container mb-5">
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
                  <p class="text-grey-darken-1 mt-6 mb-4">
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
  background: #002e3d;
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
  background: #002e3d !important;
  color: white !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 46, 61, 0.25) !important;
  transition: all 0.3s ease !important;
}

.gradient-button:hover:not(:disabled) {
  background: #004a5f !important;
  box-shadow: 0 6px 16px rgba(0, 46, 61, 0.35) !important;
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
