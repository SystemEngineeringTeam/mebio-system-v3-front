import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import favicon from '@/assets/set.webp';
import AuthUserContext from '@/components/AuthContext';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import { redirect, typedjson, useTypedRouteLoaderData } from 'remix-typedjson';
import './global.css';

export function meta() {
  return [
    { title: '名簿システム' },
    { name: 'description', content: '名簿システムv3-beta' },
  ];
}

export function links() {
  return [
    {
      rel: 'icon',
      href: favicon,
      type: 'image/webp',
    },
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
  const { memberService } = context.db.services;
  const { authenticator } = context;

  const user = await authenticator.isAuthenticated(request);

  const url = new URL(request.url);

  if (user === null && url.pathname !== '/login') {
    throw redirect('/login');
  } else if (user === null) {
    return typedjson(undefined);
  }

  const member = await memberService.selectFromSubject(user.id);

  return typedjson({ member, user });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useTypedRouteLoaderData<typeof loader>('root');

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthUserContext value={data}>
          <Header />
          {children}
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
