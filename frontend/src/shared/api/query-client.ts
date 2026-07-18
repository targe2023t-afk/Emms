import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (replaced cacheTime in v5)
      retry: (failureCount, error) => {
        // Don't retry on 401/403
        if (error instanceof Error && 'status' in error) {
          const status = (error as Error & { status: number }).status;
          if (status === 401 || status === 403) return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
