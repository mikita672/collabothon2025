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
    TIMEOUT: 300000, // 5 minutes in milliseconds
    CHECK_INTERVAL: 1000 // 1 second
  },
  LOGIN: {
    BASE_URL: 'https://ai-portfolio.app/auth',
    QR_CHECK_PROBABILITY: 0.95 // 5% chance to auto-login for demo
  }
} as const;
