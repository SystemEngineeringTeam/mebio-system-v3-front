import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Button } from '@/components/ui/button';
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

export default function LoginPage() {
  return (
    <div data-scrollable="false" className="flex flex-col items-center justify-center h-screen">
      <Form action="/auth/login" method="post" className='flex flex-col'>
        <Button type="submit">ログイン</Button>
      </Form>
    </div>
  );
}
