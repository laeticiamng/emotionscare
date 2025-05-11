
export const env = {
  NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
  // Add any other environment variables you need here
};

export default env;
