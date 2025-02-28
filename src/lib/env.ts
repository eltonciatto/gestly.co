import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_URL: z.string().url('Invalid app URL'),
  VITE_API_URL: z.string().url('Invalid API URL').optional(),
  VITE_API_KEY: z.string(),
  VITE_POSTGRES_URL: z.string().url('Invalid PostgreSQL URL'),
  VITE_JWT_SECRET: z.string(),
  VITE_JWT_EXPIRES_IN: z.string(),
  VITE_SMTP_HOST: z.string(),
  VITE_SMTP_PORT: z.coerce.number().int().positive(),
  VITE_SMTP_USERNAME: z.string(),
  VITE_SMTP_PASSWORD: z.string(),
  VITE_SMTP_SECURE: z.coerce.boolean(),
  VITE_SMTP_SENDER_NAME: z.string(),
  VITE_SUPER_ADMIN_EMAIL: z.string().email(),
  VITE_RECAPTCHA_ENABLED: z.coerce.boolean(),
  VITE_RECAPTCHA_SITE_KEY: z.string().optional(),
  VITE_SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  VITE_GA_ID: z.string().optional()
}).partial(); // Make all fields optional for development

function validateEnv() {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('❌ Environment validation error:', error);
    // Return default values for development
    return {
      VITE_APP_URL: 'http://localhost:5173',
      VITE_API_URL: 'http://localhost:3000/api',
      VITE_API_KEY: 'development',
    };
  }
}

export const env = validateEnv();