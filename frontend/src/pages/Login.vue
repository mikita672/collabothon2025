<template>
  <v-container fluid class="fill-height gradient-background">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 login-card">
          <v-card-text class="pa-4">
            <div class="d-flex flex-column align-center">
              <h1 class="text-h6 text-center mb-1">Login | QR</h1>

              <v-card class="qr-card mb-3 pa-2" variant="outlined" :border="true">
                <canvas ref="canvasRef" class="d-block mx-auto"></canvas>
              </v-card>

              <div class="d-flex align-center mb-3">
                <v-icon size="18" color="grey-darken-1" class="mr-2">mdi-cellphone</v-icon>
                <span class="text-caption text-grey-darken-1">
                  Open your mobile app and scan
                </span>
              </div>

              <div class="w-100 button-container">

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

                <!-- Email/Password Login Form -->
                <div v-if="showEmailLogin" class="mb-3">
                  <v-text-field
                    v-model="loginEmail"
                    label="Email"
                    type="email"
                    variant="outlined"
                    density="compact"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="loginPassword"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    variant="outlined"
                    density="compact"
                    class="mb-2"
                    @click:append-inner="showPassword = !showPassword"
                  />
                <!-- Google Sign In -->
                  <v-btn
                    @click="handleEmailLoginClick"
                    :loading="authStore.loading"
                    :disabled="authStore.loading"
                    size="small"
                    color="#002e3d"
                    block
                    class="text-none"
                    height="40"
                  >
                    <v-icon size="18" class="mr-1">mdi-login</v-icon>
                    Sign In
                  </v-btn>

                  <!-- Error Alert -->
                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mt-2"
                    closable
                    @click:close="errorMessage = ''"
                  >
                    {{ errorMessage }}
                  </v-alert>
                </div>

                <!-- QR Code Actions -->
                <template v-else>
                  <!-- Scan button / Waiting state -->
                  <v-btn
                    v-if="!isChecking"
                    @click="handleStartChecking"
                    size="small"
                    color="#002e3d"
                    block
                    class="mb-2  text-none"
                    height="40"
                  >
                    <v-icon size="18" class="mr-1">mdi-qrcode-scan</v-icon>
                    I've Scanned the Code
                  </v-btn>
                  <v-btn
                    v-else
                    disabled
                    size="small"
                    block
                    class="mb-2 gradient-button text-none"
                    height="40"
                  >
                    <v-icon size="18" class="mr-1 rotating">mdi-loading</v-icon>
                    Waiting for authentication...
                  </v-btn>

                  <!-- Refresh QR Code -->
                  <v-btn
                    @click="refreshQRCode"
                    variant="outlined"
                    size="small"
                    block
                    class="mb-2 text-none outlined-button"
                    height="40"
                  >
                    <v-icon size="18" class="mr-1">mdi-refresh</v-icon>
                    Generate New Code
                  </v-btn>
                </template>

                <div class="divider-container my-3">
                  <v-divider></v-divider>
                  <span class="divider-text">or</span>
                  <v-divider></v-divider>
                </div>

                <!-- Toggle Email Login -->
                <v-btn
                  @click="showEmailLogin = !showEmailLogin"
                  variant="outlined"
                  size="small"
                  block
                  class="mb-2 text-none google-button"
                  color="primary"
                  height="40"
                >
                  <v-icon size="18" class="mr-1">{{ showEmailLogin ? 'mdi-qrcode' : 'mdi-email' }}</v-icon>
                  {{ showEmailLogin ? 'Use QR Code' : 'Use Email/Password' }}
                </v-btn>

                <v-btn
                  @click="handleGoogleLoginClick"
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

                <div class="text-center mt-5 mb-4">
                  <p class="text-body-2 text-grey-darken-1">
                    Don't have an account?
                    <a href="#" class="text-primary font-weight-medium" @click.prevent="emit('go-to-register')">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>

              <v-alert
                type="info"
                variant="tonal"
                density="compact"
                class="w-100"
              >
                <div class="text-caption" style="font-size: 1 rem; line-height: 1.3;">
                  Session encrypted, expires in 5 min
                </div>
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useQRCode } from '@/composables/useQRCode';
import { useEmailLogin } from '@/composables/useEmailLogin';
import { useGoogleLogin } from '@/composables/useGoogleLogin';

const authStore = useAuthStore();

interface Props {
  onLogin?: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  login: [];
  'go-to-register': [];
}>();

// Email/Password login
const showEmailLogin = ref(false);
const {
  loginEmail,
  loginPassword,
  showPassword,
  errorMessage,
  handleEmailLogin: performEmailLogin,
  clearError
} = useEmailLogin();

// Google login
const {
  errorMessage: googleErrorMessage,
  handleGoogleLogin: performGoogleLogin,
  clearError: clearGoogleError
} = useGoogleLogin();

// QR Code login
const {
  canvasRef,
  isChecking,
  refreshQRCode,
  handleStartChecking,
  startCheckingAuth,
  stopCheckingAuth
} = useQRCode();

const handleLogin = () => {
  if (props.onLogin) {
    props.onLogin();
  }
  emit('login');
};

const handleEmailLoginClick = async () => {
  await performEmailLogin(handleLogin);
};

const handleGoogleLoginClick = async () => {
  await performGoogleLogin(handleLogin);
};

watch(isChecking, (newValue) => {
  if (newValue) {
    startCheckingAuth(handleLogin);
  } else {
    stopCheckingAuth();
  }
});
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

.qr-card {
  border-width: 2px !important;
  border-color: #e5e7eb !important;
  border-radius: 12px !important;
  background: #fafafa;
  transition: all 0.3s ease;
}

.qr-card:hover {
  border-color: #cbd5e1 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotate 1s linear infinite;
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

.outlined-button {
  border: 1.5px solid #e0e0e0 !important;
  color: #5f6368 !important;
  background-color: white !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.outlined-button:hover {
  background-color: #f8f9fa !important;
  border-color: #c6c6c6 !important;
}

.toggle-button {
  color: #1976d2 !important;
  font-weight: 500 !important;
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
</style>
