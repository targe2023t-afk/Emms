import { LoginForm } from '@/features/auth/ui';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-muted/50">
      <LoginForm />
    </div>
  );
}
