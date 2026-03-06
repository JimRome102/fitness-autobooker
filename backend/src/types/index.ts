// Platform types
export type Platform = 'classpass' | 'mindbody' | 'barrys' | 'slt' | 'y7';

export type Priority = 'high' | 'medium' | 'low';

export type BookingResult = 'success' | 'waitlisted' | 'failed' | 'error';

export type RunStatus = 'pending' | 'running' | 'completed' | 'failed';

// Database models
export interface User {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface Credential {
  id: string;
  user_id: string;
  platform: Platform;
  encrypted_username: string;
  encrypted_password: string;
  iv: string;
  auth_tag: string;
  is_active: boolean;
  last_tested?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface BookingPreference {
  id: string;
  user_id: string;
  platform: Platform;
  studio_name: string;
  class_name: string;
  class_date: string; // ISO date string
  class_time: string; // HH:MM format
  instructor?: string;
  priority: Priority;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BookingHistory {
  id: string;
  user_id: string;
  preference_id?: string;
  platform: Platform;
  studio_name: string;
  class_name: string;
  class_datetime: Date;
  instructor?: string;
  result: BookingResult;
  error_message?: string;
  attempt_timestamp: Date;
  execution_time_ms?: number;
  created_at: Date;
}

export interface BookingRun {
  id: string;
  user_id: string;
  scheduled_time: Date;
  actual_start_time?: Date;
  end_time?: Date;
  status: RunStatus;
  total_attempts: number;
  successful_bookings: number;
  waitlisted_bookings: number;
  failed_bookings: number;
  error_log?: string;
  created_at: Date;
}

// API Request/Response types
export interface CreateCredentialRequest {
  platform: Platform;
  username: string;
  password: string;
}

export interface CreatePreferenceRequest {
  platform: Platform;
  studio_name: string;
  class_name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  instructor?: string;
  priority: Priority;
}

export interface UpdatePreferenceRequest {
  studio_name?: string;
  class_name?: string;
  date?: string;
  time?: string;
  instructor?: string;
  priority?: Priority;
  is_active?: boolean;
}

// Automation types
export interface AutomationResult {
  success: boolean;
  status: 'booked' | 'waitlisted' | 'failed';
  message: string;
  executionTimeMs: number;
}
