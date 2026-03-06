import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  preferenceApi,
  CreatePreferenceRequest,
  UpdatePreferenceRequest,
  Platform,
} from '@/utils/api';

export function usePreferences(filters?: {
  platform?: Platform;
  active?: boolean;
}) {
  return useQuery({
    queryKey: ['preferences', filters],
    queryFn: () => preferenceApi.list(filters),
  });
}

export function useCreatePreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePreferenceRequest) => preferenceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}

export function useUpdatePreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePreferenceRequest }) =>
      preferenceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}

export function useDeletePreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => preferenceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}
