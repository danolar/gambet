// Configuración para diferentes entornos
export const ENVIRONMENTS = {
  development: {
    apiBaseUrl: 'http://localhost:3001/api',
    corsOrigin: 'http://localhost:5173',
    environment: 'development'
  },
  staging: {
    apiBaseUrl: 'https://sv1_gambet.danolar.xyz/api',
    corsOrigin: 'https://staging.gambet.danolar.xyz',
    environment: 'staging'
  },
  production: {
    apiBaseUrl: 'https://sv1_gambet.danolar.xyz/api', // URL correcta de la API
    corsOrigin: 'https://gambet.danolar.xyz',
    environment: 'production'
  }
} as const;

// Obtener el entorno actual
export const getCurrentEnvironment = () => {
  const env = import.meta.env.VITE_APP_ENVIRONMENT || 'development';
  return ENVIRONMENTS[env as keyof typeof ENVIRONMENTS] || ENVIRONMENTS.development;
};

// Configuración dinámica basada en el entorno
export const getEnvironmentConfig = () => {
  const currentEnv = getCurrentEnvironment();
  
  return {
    ...currentEnv,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || currentEnv.apiBaseUrl,
    corsOrigin: import.meta.env.VITE_CORS_ORIGIN || currentEnv.corsOrigin
  };
};
