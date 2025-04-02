import type { MemberContextType } from '@/components/MemberContext';
import type { $Member } from '@/models/member';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberStatus } from '@/models/member/status';
import type { ModelSchemaOf } from '@/types/model';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MemberContext from '@/components/MemberContext';
import { MemberId, Subject } from '@/models/member';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import { getAuthenticator } from '@/services/auth.server';
import { Database } from '@/services/database.server';
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import { typedjson, useTypedRouteLoaderData } from 'remix-typedjson';
import './global.css';

export function links() {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
  ];
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { Member } = context.db.models;

  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);
  const url = new URL(request.url);

  if (user === null && url.pathname !== '/login') {
    return redirect('/login');
  } else if (user === null) {
    throw new Response('認証に失敗しました', { status: 401 });
  }

  const member = await Member.fromSubjectWithResolved(Subject.from(user.id)).andThen((m) => m.buildBySelf());
  if (member.isErr()) {
    return redirect('/login');
  }

  const base = member.value.dataResolved.member.Base().match(
    (m) => m,
    Database.unwrapToResponse,
  );

  const status = member.value.dataResolved.member.Status().match((s) => s, Database.unwrapToResponse);

  return typedjson({
    auth: member.value.data,
    base: base.data,
    status: status.data,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const member = useTypedRouteLoaderData<MemberContextType>('root');

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <MemberContext value={member}>
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </MemberContext>
      </body>
    </html>
  );
}

export default function Index() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="ページ" />;
}
