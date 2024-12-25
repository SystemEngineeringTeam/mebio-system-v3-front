import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Button, Text } from '@/components/basic';
import { getAuthenticator } from '@/utils/auth.server';
import { redirect } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { styled } from 'restyle';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  const user = await authenticator.isAuthenticated(request);
  if (user !== null) {
    return redirect('/');
  }
  return null;
};

const Centered = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '1rem',
  textAlign: 'center',
});

export default function LoginPage() {
  return (
    <Centered data-scrollable="false">
      <Text bold>ログインしてください</Text>

      <Form action="/auth/login" method="post">
        <Button type="submit">Login with Google</Button>
      </Form>
    </Centered>
  );
}
