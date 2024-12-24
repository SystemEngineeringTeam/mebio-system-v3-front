import type { createPagesFunctionHandlerParams } from '@remix-run/cloudflare-pages';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '../build/server';

export const onRequest = createPagesFunctionHandler({ build } as createPagesFunctionHandlerParams<any>);
