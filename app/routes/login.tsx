import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/services/auth.server';
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

// const Centered = styled('div', {
//   height: '100%',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   flexDirection: 'column',
//   gap: '1rem',
//   textAlign: 'center',
// });

export default function LoginPage() {
  return (
    <div data-scrollable="false">
      <p>ログインしてください</p>

      <Form action="/auth/login" method="post">
        <button type="submit">Login with Google</button>
      </Form>
    </div>
  );
}
