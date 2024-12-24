import { Authenticator } from 'remix-auth';
import { GoogleStrategy } from 'remix-auth-google';
import { getSessionStorage } from './session.server';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

let authenticator: Authenticator<AuthUser>;

export function getAuthenticator(env: Env) {
  if (authenticator !== undefined) {
    return authenticator;
  }

  const sessionStorage = getSessionStorage(env.SESSION_SECRET);
  authenticator = new Authenticator<AuthUser>(sessionStorage);
  authenticator.use(new GoogleStrategy<AuthUser>(
    {
      clientID: env.FIREBASE_AUTH_CLIENT_ID,
      clientSecret: env.FIREBASE_AUTH_CLIENT_SECRET,
      callbackURL: env.FIREBASE_AUTH_CALLBACK_URL,
    },
    async ({ profile }) => ({
      name: profile.displayName,
      email: profile.emails.length > 0 ? profile.emails[0].value : '',
      id: profile.id,
    }),
  ));

  return authenticator;
}
