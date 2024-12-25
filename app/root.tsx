import type { AuthUser } from '@/utils/auth.server';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import AuthUserContext from '@/components/AuthtContext';
import Header from '@/components/Header';
import GlobalStyles from '@/GlobalStyles';
import { getAuthenticator } from '@/utils/auth.server';
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

export const links: LinksFunction = () => [
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

export async function loader({ request, context }: LoaderFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);

  const url = new URL(request.url);

  if (user === null && url.pathname !== '/login') {
    return redirect('/login');
  }

  return Response.json({ user });
};

interface LoaderData {
  user: AuthUser;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<LoaderData>();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthUserContext value={user}>
          <GlobalStyles />
          <Header />
          <main>{children}</main>
        </AuthUserContext>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
