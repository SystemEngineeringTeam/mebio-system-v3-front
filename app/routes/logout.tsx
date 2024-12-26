import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/services/auth.server';
import { redirect } from '@remix-run/cloudflare';

export function loader() {
  redirect('/login');
}

export async function action({ request, context }: ActionFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  await authenticator.logout(request, { redirectTo: '/' });
}
