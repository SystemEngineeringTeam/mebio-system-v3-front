import type { SessionStorage } from '@remix-run/cloudflare';
import { createCookieSessionStorage } from '@remix-run/cloudflare';

let sessionStorage: SessionStorage;

export function getSessionStorage(sessionSecret: string) {
  if (sessionStorage !== undefined) {
    return sessionStorage;
  }

  sessionStorage
  = createCookieSessionStorage({
      cookie: {
        name: '__session',
        httpOnly: true,
        maxAge: 600,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionSecret],
        secure: process.env.NODE_ENV === 'production',
      },
    });

  return sessionStorage;
}
