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
    <div className="flex h-screen flex-col items-center justify-center" data-scrollable="false">
      <Form action="/auth/login" className="flex flex-col" method="post">
        <Button type="submit">ログイン</Button>
      </Form>
    </div>
  );
}
