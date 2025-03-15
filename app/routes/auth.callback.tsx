import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/services/auth.server';
import { getSessionStorage } from '@/services/session.server';
import { redirect } from '@remix-run/cloudflare';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { SESSION_SECRET } = context.cloudflare.env;

  const authenticator = getAuthenticator(context.cloudflare.env);

  const user = await authenticator.authenticate('auth0', request);

  if (user === null) {
    return redirect('/login');
  }

  const { getSession, commitSession } = getSessionStorage(SESSION_SECRET);
  const session = await getSession(request.headers.get('Cookie'));

  session.set(authenticator.sessionKey, user);
  session.set(authenticator.sessionStrategyKey ?? 'strategy', 'auth0');
  const cookie = await commitSession(session, {
    expires: new Date(Date.now() + 600_000),
  });
  const redirectOption = {
    headers: { 'Set-Cookie': cookie },
  };

  return redirect('/', redirectOption);
};
