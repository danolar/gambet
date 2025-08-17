// Configuración de variables de entorno
export const ENV_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  CHILIZ_RPC_URL: import.meta.env.VITE_CHILIZ_RPC_URL || 'https://spicy-rpc.chiliz.com/',
  CHILIZ_CHAIN_ID: import.meta.env.VITE_CHILIZ_CHAIN_ID || '88882',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Gambet Vision',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
} as const;

// Validar configuración requerida
export const validateEnv = () => {
  if (!ENV_CONFIG.OPENAI_API_KEY) {
    console.warn('⚠️ VITE_OPENAI_API_KEY no está configurado. El agente IA no funcionará.');
    return false;
  }
  return true;
};
