import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import MemberPage from '@/pages/MemberPage';
import { useRouteError } from '@remix-run/react';
import { typedjson } from 'remix-typedjson';

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.uuid === undefined) {
    throw new Response('uuid が見つかりません', { status: 404 });
  }

  return typedjson({});
}

export default function Index() {
  return <MemberPage />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="部員情報" />;
}
