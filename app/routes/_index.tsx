import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/services/auth.server';
import { redirect } from '@remix-run/cloudflare';
import { Outlet } from '@remix-run/react';

export const meta: MetaFunction = () => [
  { title: 'New Remix App' },
  { name: 'description', content: 'Welcome to Remix!' },
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);
  if (user === null) {
    return redirect('/login');
  }

  return Response.json({ user });
};

export default function Index() {
  return <Outlet />;
};
