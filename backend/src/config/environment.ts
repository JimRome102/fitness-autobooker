import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  nodeEnv: string;
  port: number;
  frontendUrl: string;

  // Database
  supabaseUrl: string;
  supabaseAnonKey: string;

  // Encryption
  encryptionKey: string;

  // Email
  resendApiKey: string;
  resendFromEmail: string;

  // Application
  defaultUserId: string;

  // Puppeteer
  puppeteerHeadless: boolean;
  puppeteerTimeout: number;

  // Logging
  logLevel: string;
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',

  encryptionKey: process.env.ENCRYPTION_KEY || '',

  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@fitbookauto.com',

  defaultUserId: process.env.DEFAULT_USER_ID || 'default-user',

  puppeteerHeadless: process.env.PUPPETEER_HEADLESS !== 'false',
  puppeteerTimeout: parseInt(process.env.PUPPETEER_TIMEOUT || '30000', 10),

  logLevel: process.env.LOG_LEVEL || 'info'
};

// Validate critical environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'ENCRYPTION_KEY'
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0 && config.nodeEnv === 'production') {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}
