/**
 * Environment variables configuration
 * All environment variables should be defined here for type safety and centralization
 */

interface EnvConfig {
  apiBaseUrl: string;
  agentApiBaseUrl: string;
  // Add other environment variables here as needed
}

// Validate required environment variables
const validateEnv = (): EnvConfig => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const agentApiBaseUrl = import.meta.env.VITE_AGENT_API_BASE_URL;
  
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL environment variable is required');
  }
  if (!agentApiBaseUrl) {
    throw new Error('VITE_AGENT_API_BASE_URL environment variable is required');
  }

  return {
    apiBaseUrl,
    agentApiBaseUrl,
  };
};

// Export validated configuration
export const config = validateEnv(); 