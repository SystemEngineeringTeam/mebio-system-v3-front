import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { getSessionStorage } from './session.server';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  iconUrl: string;
}

let authenticator: Authenticator<AuthUser>;

export function getAuthenticator(env: Env) {
  if (authenticator !== undefined) {
    return authenticator;
  }

  const sessionStorage = getSessionStorage(env.SESSION_SECRET);
  authenticator = new Authenticator<AuthUser>(sessionStorage);
  authenticator.use(new Auth0Strategy(
    {
      callbackURL: env.AUTH0_CALLBACK_URL,
      clientID: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      domain: env.AUTH0_DOMAIN,
    },
    async ({ profile }) => ({
      id: profile?.id ?? '',
      name: profile?.displayName ?? '',
      email: profile?.emails?.[0]?.value ?? '',
      iconUrl: profile?.photos?.[0]?.value ?? '',
    }),
  ), 'auth0');

  return authenticator;
}
