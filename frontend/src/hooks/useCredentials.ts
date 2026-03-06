import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  credentialApi,
  CreateCredentialRequest,
  UpdateCredentialRequest,
} from '@/utils/api';

export function useCredentials() {
  return useQuery({
    queryKey: ['credentials'],
    queryFn: () => credentialApi.list(),
  });
}

export function useCreateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCredentialRequest) => credentialApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}

export function useUpdateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCredentialRequest }) =>
      credentialApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => credentialApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}
