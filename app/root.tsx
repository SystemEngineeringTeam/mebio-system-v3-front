import type { AuthUser } from '@/services/auth.server';
import type { MemberStatus } from '@/types/member';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import AuthUserContext from '@/components/AuthtContext';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import GlobalStyles from '@/GlobalStyles';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import { getAuthenticator } from '@/services/auth.server';
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react';

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

type LoaderData = MemberStatus & AuthUser | null;

export async function loader({ request, context }: LoaderFunctionArgs): Promise<LoaderData | Response> {
  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);

  const url = new URL(request.url);

  if (user === null && url.pathname !== '/login') {
    return redirect('/login');
  } else if (user === null) {
    return null;
  }

  const status: MemberStatus = {
    isAdmin: true,
    status: 'temporary',
  };

  return { ...user, ...status };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useRouteLoaderData<LoaderData>('root');

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthUserContext value={user ?? null}>
          <GlobalStyles />
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </AuthUserContext>
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
