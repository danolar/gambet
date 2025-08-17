// Configuración para diferentes entornos
export const ENVIRONMENTS = {
  development: {
    apiBaseUrl: 'http://localhost:3001/api',
    corsOrigin: 'http://localhost:5173',
    environment: 'development'
  },
  production: {
    apiBaseUrl: 'http://sv1_gambet.danolar.xyz/api', // Usar HTTP temporalmente
    corsOrigin: 'https://gambet.danolar.xyz',
    environment: 'production'
  }
} as const;

// Obtener el entorno actual
export const getCurrentEnvironment = () => {
  const env = import.meta.env.VITE_APP_ENVIRONMENT || 'production'; // Cambiar a production por defecto
  return ENVIRONMENTS[env as keyof typeof ENVIRONMENTS] || ENVIRONMENTS.production;
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
