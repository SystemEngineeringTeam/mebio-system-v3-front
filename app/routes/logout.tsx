import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/utils/auth.server';
import { redirect } from '@remix-run/cloudflare';

export const loader: LoaderFunction = () => redirect('/login');

export async function action({ request, context }: ActionFunctionArgs) {
  const authenticator = getAuthenticator(context.cloudflare.env);
  await authenticator.logout(request, { redirectTo: '/' });
}
