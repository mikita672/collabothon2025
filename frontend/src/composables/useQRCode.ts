import { ref, onMounted, onUnmounted, watch } from 'vue';
import { APP_CONSTANTS } from '@/config/constants';
import { DatabaseService } from '@/services/database';
import { useAuthStore } from '@/stores/auth';
// @ts-ignore
import QRCode from 'qrcode';

export function useQRCode() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const sessionId = ref('');
  const isChecking = ref(false);
  const authStore = useAuthStore();
  let unsubscribeSession: (() => void) | null = null;

  const generateSessionId = (): string => {
    return `${APP_CONSTANTS.SESSION.PREFIX}${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const generateQRCode = async (data: string) => {
    if (canvasRef.value) {
      try {
        await QRCode.toCanvas(canvasRef.value, data, {
          width: APP_CONSTANTS.QR_CODE.WIDTH,
          margin: APP_CONSTANTS.QR_CODE.MARGIN,
          color: {
            dark: APP_CONSTANTS.QR_CODE.COLORS.DARK,
            light: APP_CONSTANTS.QR_CODE.COLORS.LIGHT,
          },
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  const refreshQRCode = async () => {
    if (unsubscribeSession) {
      console.log('Stopping old listener');
      unsubscribeSession();
      unsubscribeSession = null;
    }

    // Remove old session from database
    if (sessionId.value) {
      await DatabaseService.removeSession(sessionId.value);
    }

    const newSessionId = generateSessionId();
    sessionId.value = newSessionId;
    
    try {
      await DatabaseService.writeSession(newSessionId);
      console.log('Session written to Realtime Database:', newSessionId);
    } catch (error) {
      console.error('Error writing session:', error);
    }

    const loginUrl = `${APP_CONSTANTS.LOGIN.BASE_URL}?session=${newSessionId}`;
    generateQRCode(loginUrl);
    
    isChecking.value = true;
  };

  const startCheckingAuth = (onSuccess: () => void) => {
    if (sessionId.value && isChecking.value) {
      console.log('Starting to listen to session:', sessionId.value);
      
      unsubscribeSession = DatabaseService.listenToSession(
        sessionId.value,
        async (customToken: string) => {
          console.log('QR scanned! Received Custom Token');
          isChecking.value = false;
          
          // Login user with Custom Token
          try {
            await authStore.loginWithToken(customToken);
            console.log('User successfully logged in via QR');
            onSuccess();
          } catch (error) {
            console.error('Error logging in via QR:', error);
          }
        }
      );
    }
  };

  const stopCheckingAuth = () => {
    if (unsubscribeSession) {
      unsubscribeSession();
      unsubscribeSession = null;
    }
  };

  const handleStartChecking = () => {
    isChecking.value = true;
  };

  watch(isChecking, (newValue, oldValue) => {
    console.log('isChecking changed', oldValue, '->', newValue);
    if (!newValue && oldValue) {
      stopCheckingAuth();
    }
  });

  onMounted(() => {
    refreshQRCode();
  });

  onUnmounted(() => {
    stopCheckingAuth();
    if (sessionId.value) {
      DatabaseService.removeSession(sessionId.value);
    }
  });

  return {
    canvasRef,
    sessionId,
    isChecking,
    refreshQRCode,
    handleStartChecking,
    startCheckingAuth,
    stopCheckingAuth
  };
}
