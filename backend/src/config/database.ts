import { createClient } from '@supabase/supabase-js';
import { config } from './environment';
import { logger } from '../utils/logger';

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  logger.warn('Supabase credentials not configured. Database operations will fail.');
}

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      persistSession: false
    }
  }
);

// Test connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      logger.error('Database connection test failed:', error);
      return false;
    }

    logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection error:', error);
    return false;
  }
}
