import type { Brand } from '@/types/utils';
import { toBrand } from '@/utils';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { getSessionStorage } from './session.server';

export interface AuthUser {
  id: Subject;
  email: string;
  iconUrl: string;
  name: string;
}

export type Subject = Brand<'subject', string>;
export const Subject = {
  from: toBrand<'subject'>,
};

export type AuthRes = AuthUser | null;
let authenticator: Authenticator<AuthRes>;

export function getAuthenticator(env: Env) {
  if (authenticator !== undefined) {
    return authenticator;
  }

  const sessionStorage = getSessionStorage(env.SESSION_SECRET);
  const callbackURL = new URL(env.CF_PAGES_URL);
  callbackURL.pathname = '/auth/callback';
  authenticator = new Authenticator<AuthRes>(sessionStorage);
  authenticator.use(new Auth0Strategy(
    {
      callbackURL: env.AUTH0_CALLBACK_URL ?? callbackURL.toString(),
      clientID: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      domain: env.AUTH0_DOMAIN,
    },
    async ({ profile }) => {
      const email = profile.emails?.[0]?.value;
      const iconUrl = profile?.photos?.[0]?.value;
      if (profile.id === undefined) return null;
      if (email === undefined) return null;
      if (iconUrl === undefined) return null;
      if (profile.displayName === undefined) return null;

      return {
        id: Subject.from(profile.id),
        email,
        iconUrl,
        name: profile.displayName,
      } satisfies AuthUser;
    },
  ), 'auth0');

  return authenticator;
}
