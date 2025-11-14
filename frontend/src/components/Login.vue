<template>
  <v-container fluid class="fill-height gradient-background">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 login-card">
          <v-card-text class="pa-4">
            <div class="d-flex flex-column align-center">
              <!-- Logo/Icon -->
              <v-avatar class="mb-2 gradient-avatar" size="60">
                <v-icon size="36" color="white">mdi-brain</v-icon>
              </v-avatar>

              <!-- Title -->
              <h1 class="text-h6 text-center mb-1">AI Portfolio Manager</h1>
              <p class="text-caption text-center text-grey-darken-1 mb-3">
                Scan the QR code with your mobile app to log in
              </p>

              <!-- QR Code -->
              <v-card class="qr-card mb-3 pa-2" variant="outlined" :border="true">
                <canvas ref="canvasRef" class="d-block mx-auto"></canvas>
              </v-card>

              <!-- Mobile instruction -->
              <div class="d-flex align-center mb-3">
                <v-icon size="18" color="grey-darken-1" class="mr-2">mdi-cellphone</v-icon>
                <span class="text-caption text-grey-darken-1">
                  Open your mobile app and scan
                </span>
              </div>

              <!-- Action buttons -->
              <div class="w-100 button-container">
                <!-- Scan button / Waiting state -->
                <v-btn
                  v-if="!isChecking"
                  @click="handleStartChecking"
                  color="primary"
                  size="small"
                  block
                  class="mb-2 gradient-button text-none"
                  height="36"
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
                  height="36"
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
                  class="mb-2 text-none"
                  height="36"
                >
                  <v-icon size="18" class="mr-1">mdi-refresh</v-icon>
                  Generate New Code
                </v-btn>

                <!-- Demo skip section -->
                <v-divider class="my-2"></v-divider>
                <p class="text-caption text-center text-grey-darken-1 mb-2">
                  For demo: skip QR login
                </p>
                <v-btn
                  @click="handleLogin"
                  variant="text"
                  size="small"
                  block
                  class="text-none"
                  color="primary"
                  height="32"
                >
                  Continue to Dashboard
                  <v-icon class="ml-1" size="18">mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <!-- Security notice -->
              <v-alert
                type="info"
                variant="tonal"
                density="compact"
                class="mt-2 w-100 security-alert"
              >
                <div class="text-caption" style="font-size: 0.7rem; line-height: 1.3;">
                  <strong>🔒</strong> Session encrypted, expires in 5 min
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
// @ts-ignore
import QRCode from 'qrcode';

interface Props {
  onLogin?: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  login: [];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const sessionId = ref('');
const isChecking = ref(false);
let checkInterval: ReturnType<typeof setInterval> | null = null;

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

const generateQRCode = async (data: string) => {
  if (canvasRef.value) {
    try {
      await QRCode.toCanvas(canvasRef.value, data, {
        width: 180,
        margin: 1,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
};

const refreshQRCode = () => {
  const newSessionId = generateSessionId();
  sessionId.value = newSessionId;
  const loginUrl = `https://ai-portfolio.app/auth?session=${newSessionId}`;
  generateQRCode(loginUrl);
};

const handleStartChecking = () => {
  isChecking.value = true;
};

const handleLogin = () => {
  if (props.onLogin) {
    props.onLogin();
  }
  emit('login');
};

// Simulate checking for login
const startCheckingAuth = () => {
  if (sessionId.value && isChecking.value) {
    checkInterval = setInterval(() => {
      // In a real implementation, you would check with your backend
      // if the session has been authenticated from the mobile app
      const randomCheck = Math.random();
      if (randomCheck > 0.95) { // 5% chance to auto-login for demo
        if (checkInterval) {
          clearInterval(checkInterval);
        }
        handleLogin();
      }
    }, 1000);
  }
};

const stopCheckingAuth = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
};

// Watch for checking state changes
watch(isChecking, (newValue) => {
  if (newValue) {
    startCheckingAuth();
  } else {
    stopCheckingAuth();
  }
});

onMounted(() => {
  refreshQRCode();
});

onUnmounted(() => {
  stopCheckingAuth();
});
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
</style>
