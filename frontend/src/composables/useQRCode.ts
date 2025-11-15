import { ref, onMounted, onUnmounted, watch } from 'vue';
import { APP_CONSTANTS } from '@/config/constants';
// @ts-ignore
import QRCode from 'qrcode';

export function useQRCode() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const sessionId = ref('');
  const isChecking = ref(false);
  let checkInterval: ReturnType<typeof setInterval> | null = null;

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

  const refreshQRCode = () => {
    const newSessionId = generateSessionId();
    sessionId.value = newSessionId;
    const loginUrl = `${APP_CONSTANTS.LOGIN.BASE_URL}?session=${newSessionId}`;
    generateQRCode(loginUrl);
  };

  const startCheckingAuth = (onSuccess: () => void) => {
    if (sessionId.value && isChecking.value) {
      checkInterval = setInterval(() => {
        const randomCheck = Math.random();
        if (randomCheck > APP_CONSTANTS.LOGIN.QR_CHECK_PROBABILITY) {
          if (checkInterval) {
            clearInterval(checkInterval);
          }
          onSuccess();
        }
      }, APP_CONSTANTS.SESSION.CHECK_INTERVAL);
    }
  };

  const stopCheckingAuth = () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  };

  const handleStartChecking = () => {
    isChecking.value = true;
  };

  watch(isChecking, (newValue, oldValue) => {
    if (!newValue && oldValue) {
      stopCheckingAuth();
    }
  });

  onMounted(() => {
    refreshQRCode();
  });

  onUnmounted(() => {
    stopCheckingAuth();
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
