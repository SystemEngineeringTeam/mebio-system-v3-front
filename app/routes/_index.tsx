import type { AuthUser } from '@/utils/auth.server';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import AuthContext from '@/components/AuthtContext';
import { getAuthenticator } from '@/utils/auth.server';
import { redirect } from '@remix-run/cloudflare';
import { Form, Outlet, useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => [
  { title: 'New Remix App' },
  { name: 'description', content: 'Welcome to Remix!' },
];

interface LoaderData {
  user: AuthUser;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);
  if (user === null) {
    return redirect('/login');
  }

  return Response.json({ user });
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <AuthContext value={user}>
      <Outlet />
      <Form action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
    </AuthContext>
  );
};
