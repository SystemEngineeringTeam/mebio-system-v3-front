import type { AuthRes } from '@/services/auth.server';
import type { AppLoadContext } from '@remix-run/cloudflare';
import type { Authenticator } from 'remix-auth';
import type { PlatformProxy } from 'wrangler';
import { injectPrismaClient } from '@/services/__prisma.server';
import { getAuthenticator } from '@/services/auth.server';
import { Database } from '@/services/database.service';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    __prisma: Awaited<ReturnType<typeof injectPrismaClient>>;
    db: Database;
    authenticator: Authenticator<AuthRes>;
  }
}

// ref: https://github.com/chimame/remix-prisma-d1-on-cloudflare-pages/blob/e98cfb57b80e836186ef587a69941b61fe5cd09d/load-context.ts
export async function getLoadContext({ context }: {
  request: Request;
  context: { cloudflare: Cloudflare };
}): Promise<AppLoadContext> {
  const prisma = await injectPrismaClient(context.cloudflare.env.DB);
  return {
    ...context,
    __prisma: prisma,
    db: new Database(prisma, context.cloudflare.env),
    authenticator: getAuthenticator(context.cloudflare.env),
  };
}
