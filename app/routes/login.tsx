import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/utils/auth.server';
import { redirect } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);
  if (user !== null) {
    return redirect('/');
  }
  return null;
};

export default function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      <Form action="/auth/login" method="post">
        <button type="submit">login with google</button>
      </Form>
    </div>
  );
}
