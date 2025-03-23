import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/services/auth.server';
import { redirect } from '@remix-run/cloudflare';

export async function loader({ request, context }: ActionFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  await authenticator.logout(request, { redirectTo: '/' });

  return redirect('/');
}

export async function action({ request, context }: ActionFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  await authenticator.logout(request, { redirectTo: '/' });

  return redirect('/');
}
