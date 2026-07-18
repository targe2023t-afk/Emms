import { Toaster } from '@/shared/ui/toaster';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => (
  <>
    {children}
    <Toaster />
  </>
);
