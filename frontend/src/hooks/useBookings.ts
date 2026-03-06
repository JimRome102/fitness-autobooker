import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi, BookingResult, Platform } from '@/utils/api';

export function useBookingHistory(filters?: {
  platform?: Platform;
  result?: BookingResult;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['bookings', 'history', filters],
    queryFn: () => bookingApi.history(filters),
  });
}

export function useBookingStats() {
  return useQuery({
    queryKey: ['bookings', 'stats'],
    queryFn: () => bookingApi.stats(),
  });
}

export function useRunBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dryRun?: boolean) => bookingApi.run(dryRun),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
