import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export type Platform = 'classpass' | 'mindbody' | 'barrys' | 'slt' | 'y7';
export type Priority = 'high' | 'medium' | 'low';
export type BookingResult = 'success' | 'waitlisted' | 'failed' | 'error';

export interface Credential {
  id: string;
  platform: Platform;
  is_active: boolean;
  last_tested: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCredentialRequest {
  platform: Platform;
  username: string;
  password: string;
  is_active?: boolean;
}

export interface UpdateCredentialRequest {
  username?: string;
  password?: string;
  is_active?: boolean;
}

export interface BookingPreference {
  id: string;
  user_id: string;
  platform: Platform;
  studio_name: string;
  class_name: string;
  class_date: string;
  class_time: string;
  instructor?: string;
  priority: Priority;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePreferenceRequest {
  platform: Platform;
  studio_name: string;
  class_name: string;
  class_date: string;
  class_time: string;
  instructor?: string;
  priority?: Priority;
  is_active?: boolean;
}

export interface UpdatePreferenceRequest {
  studio_name?: string;
  class_name?: string;
  class_date?: string;
  class_time?: string;
  instructor?: string;
  priority?: Priority;
  is_active?: boolean;
}

export interface BookingHistory {
  id: string;
  user_id: string;
  preference_id: string;
  platform: Platform;
  studio_name: string;
  class_name: string;
  class_datetime: string;
  instructor?: string;
  result: BookingResult;
  error_message?: string;
  attempt_timestamp: string;
  execution_time_ms: number;
  created_at: string;
}

export interface BookingStats {
  total: number;
  successful: number;
  waitlisted: number;
  failed: number;
  successRate: number;
}

export interface BookingRunResult {
  status: string;
  summary?: {
    total: number;
    successful: number;
    waitlisted: number;
    failed: number;
  };
  details?: Array<{
    preferenceId: string;
    platform: Platform;
    className: string;
    result: string;
    message: string;
    executionTimeMs: number;
  }>;
}

// Credential API
export const credentialApi = {
  list: async (): Promise<Credential[]> => {
    const response = await apiClient.get('/api/credentials');
    return response.data.data;
  },

  create: async (data: CreateCredentialRequest): Promise<Credential> => {
    const response = await apiClient.post('/api/credentials', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateCredentialRequest): Promise<Credential> => {
    const response = await apiClient.put(`/api/credentials/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/credentials/${id}`);
  },
};

// Preference API
export const preferenceApi = {
  list: async (filters?: {
    platform?: Platform;
    active?: boolean;
  }): Promise<BookingPreference[]> => {
    const response = await apiClient.get('/api/preferences', { params: filters });
    return response.data.data;
  },

  create: async (data: CreatePreferenceRequest): Promise<BookingPreference> => {
    const response = await apiClient.post('/api/preferences', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdatePreferenceRequest): Promise<BookingPreference> => {
    const response = await apiClient.put(`/api/preferences/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/preferences/${id}`);
  },
};

// Booking API
export const bookingApi = {
  run: async (dryRun?: boolean): Promise<BookingRunResult> => {
    const response = await apiClient.post('/api/bookings/run', { dryRun });
    return response.data.data;
  },

  history: async (filters?: {
    platform?: Platform;
    result?: BookingResult;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<BookingHistory[]> => {
    const response = await apiClient.get('/api/bookings/history', { params: filters });
    return response.data.data;
  },

  stats: async (): Promise<BookingStats> => {
    const response = await apiClient.get('/api/bookings/stats');
    return response.data.data;
  },
};
