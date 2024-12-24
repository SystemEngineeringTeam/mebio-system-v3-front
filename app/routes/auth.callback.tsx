import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getAuthenticator } from '@/utils/auth.server';
import { getSessionStorage } from '@/utils/session.server';
import { redirect } from '@remix-run/cloudflare';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { SESSION_SECRET } = context.cloudflare.env;

  const authenticator = getAuthenticator(context.cloudflare.env);

  const user = await authenticator.authenticate('google', request);

  if (user === null) {
    return redirect('/login');
  }

  const { getSession, commitSession } = getSessionStorage(SESSION_SECRET);
  const session = await getSession(request.headers.get('Cookie'));

  session.set(authenticator.sessionKey, user);
  session.set(authenticator.sessionStrategyKey ?? 'strategy', 'google');
  const cookie = await commitSession(session, {
    expires: new Date(Date.now() + 600_000),
  });
  const rediretOption = {
    headers: { 'Set-Cookie': cookie },
  };

  return redirect('/', rediretOption);
};
