import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import MemberPage from '@/pages/MemberPage';
import { useRouteError } from '@remix-run/react';

interface LoaderData {}

export function loader(): LoaderData {
  return {};
}

export default function Index() {
  // const {} = useLoaderData<typeof loader>();
  return <MemberPage />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="部員情報" />;
}
