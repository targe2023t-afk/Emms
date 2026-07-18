import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { RootLayout } from '@/widgets/layout/ui/root-layout';
import { ProtectedRoute } from '@/app/router/protected-route';
import { PublicRoute } from '@/app/router/public-route';
import { LoadingScreen } from '@/shared/ui/loading-screen';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'login',
        element: <PublicRoute>{withSuspense(LoginPage)}</PublicRoute>,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute>{withSuspense(DashboardPage)}</ProtectedRoute>,
      },
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
]);
