import { AxiosError } from 'axios';
import { toast } from '@/shared/ui/use-toast';

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export const handleApiError = (error: AxiosError<ApiErrorResponse>): never => {
  const response = error.response;
  const data = response?.data;

  if (!response) {
    toast({
      title: 'Network Error',
      description: 'Unable to connect to the server. Please check your connection.',
      variant: 'destructive',
    });
    throw error;
  }

  const status = response.status;
  const message = data?.message || error.message;

  switch (status) {
    case 400:
      toast({
        title: 'Bad Request',
        description: message,
        variant: 'destructive',
      });
      break;
    case 401:
      // Handled by auth interceptor
      break;
    case 403:
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
        variant: 'destructive',
      });
      break;
    case 404:
      toast({
        title: 'Not Found',
        description: 'The requested resource was not found.',
        variant: 'destructive',
      });
      break;
    case 422:
      toast({
        title: 'Validation Error',
        description: data?.errors ? Object.values(data.errors).flat().join(', ') : message,
        variant: 'destructive',
      });
      break;
    case 500:
      toast({
        title: 'Server Error',
        description: `An unexpected error occurred. Trace ID: ${data?.traceId || 'N/A'}`,
        variant: 'destructive',
      });
      break;
    default:
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
  }

  throw error;
};
