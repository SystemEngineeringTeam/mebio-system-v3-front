import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import { Outlet, useRouteError } from '@remix-run/react';

export default function Index() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="ページ" />;
}
