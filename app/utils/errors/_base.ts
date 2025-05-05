import type { Assert } from '@/types/utils';
import { DatabaseError } from '@/utils/errors/database';

export type ErrorEntry =
  | DatabaseError;

type IsEveryErrorEntryValidType = ErrorEntry extends {
  type: string;
  detail: unknown;
  context: unknown;
  info: unknown;
} ? true : false;
type _Check = Assert<IsEveryErrorEntryValidType>;

export type ErrorEntryImpl<E extends ErrorEntry> =
  & {
    readonly layer: string;
    readonly type: E['type'];
    toString: (self: E) => string;
    create: (...args: any[]) => E;
    toExposed: (self: E) => any;
    toStatusCode: (self: E) => number;
  }
  & Record<string, unknown>;

const ErrorEntries = {
  DATABASE_ERROR: DatabaseError,
} as const satisfies {
  [K in ErrorEntry['type']]: ErrorEntryImpl<Extract<ErrorEntry, { type: K }>>;
};
function getImplWithDowncast<T extends ErrorEntry, I = ErrorEntryImpl<ErrorEntry>>(type: T['type']): I {
  return ErrorEntries[type] as I;
}

export const ErrorEntry = {
  toString: (self: ErrorEntry) => {
    const date = new Date();
    const impl = getImplWithDowncast(self.type);
    const { layer, type, toString } = impl;
    return `[${date.toISOString()}] [@${layer}/${type}] ${toString(self)}`;
  },
  toResponse: (self: ErrorEntry) => {
    const impl = getImplWithDowncast(self.type);
    const { toExposed, toStatusCode } = impl;
    const statusCode = toStatusCode(self);
    return new Response(
      JSON.stringify(toExposed(self)),
      {
        status: statusCode,
      },
    );
  },
};
