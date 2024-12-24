import type { createPagesFunctionHandlerParams } from '@remix-run/cloudflare-pages';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
// eslint-disable-next-line no-restricted-imports
import * as build from '../build/server';

export const onRequest = createPagesFunctionHandler({ build } as createPagesFunctionHandlerParams<any>);
