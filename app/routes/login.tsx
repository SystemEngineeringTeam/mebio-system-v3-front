import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/services/auth.server';
import { redirect } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { typedjson } from 'remix-typedjson';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);
  if (user !== null) {
    return redirect('/');
  }
  return typedjson(null);
};

export default function LoginPage() {
  return (
    <div data-scrollable="false">
      <p>ログインしてください</p>

      <Form action="/auth/login" method="post">
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
