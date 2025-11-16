export const APP_CONSTANTS = {
  QR_CODE: {
    WIDTH: 180,
    MARGIN: 1,
    COLORS: {
      DARK: '#1f2937',
      LIGHT: '#ffffff'
    }
  },
  SESSION: {
    PREFIX: 'session_',
    TIMEOUT: 300000, 
    CHECK_INTERVAL: 1000 
  },
  LOGIN: {
    BASE_URL: import.meta.env.VITE_QR_LOGIN_URL || 'http://localhost:5173/auth',
    QR_CHECK_PROBABILITY: 0.95 
  }
} as const;
