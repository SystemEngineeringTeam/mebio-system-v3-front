import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import MemberEditPage from '@/pages/MemberEditPage';
import { redirect, useRouteError } from '@remix-run/react';

interface LoaderData {}

export function loader(): LoaderData {
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  // TODO: 更新処理 (memberRes.data) UUID や position が勝手に変更されないように注意

  // 1つ上の階層にリダイレクト
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/\/[^/]+$/, '');
  return redirect(url.toString());
}

export default function Index() {
  // const { } = useLoaderData<typeof loader>();
  return <MemberEditPage />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="部員情報" />;
}
