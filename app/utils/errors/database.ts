import type { ModelMetadata } from '@/types/model';
import type { Nullable } from '@/types/utils';
import type { ErrorEntryImpl } from '@/utils/errors/_base';
import type { PrismaClientError } from '@/utils/errors/database/prisma-bridge';
import { ModelOperationError } from '@/utils/errors/database/model-operation';
import { PrismaBridgeError } from '@/utils/errors/database/prisma-bridge';
import { ResultAsync } from 'neverthrow';

export interface DatabaseError {
  type: 'DATABASE_ERROR';
  detail:
    | PrismaBridgeError
    | ModelOperationError;
  context: {
    metadata: ModelMetadata<any, 'CATCH_ALL'>;
    caller: string;
  };
  info: {
    message: string;
    hint: Nullable<string>;
  };
}

const DatabaseErrorDetails = {
  PRISMA_BRIDGE_ERROR: PrismaBridgeError,
  MODEL_OPERATION_ERROR: ModelOperationError,
} as const satisfies {
  [K in DatabaseError['detail']['type']]: DatabaseErrorEntryImpl<Extract<DatabaseError['detail'], { type: K }>>
};

function getImplWithDowncast<T extends DatabaseError['detail'], I = DatabaseErrorEntryImpl<DatabaseError['detail']>>(type: T['type']): I {
  return DatabaseErrorDetails[type] as I;
}

export const DatabaseError = {
  layer: 'API',
  type: 'DATABASE_ERROR',

  create(metadata: ModelMetadata<any, 'CATCH_ALL'>, caller: string, detail: DatabaseError['detail']) {
    const impl = getImplWithDowncast(detail.type);
    return {
      type: this.type,
      detail,
      context: { metadata, caller },
      info: impl.getInfo(metadata)(detail),
    };
  },

  createWith: (metadata: ModelMetadata<any, 'CATCH_ALL'>) => (caller: string) => (detail: DatabaseError['detail']) =>
    DatabaseError.create(metadata, caller, detail),

  toString: (self) => {
    const { type, context, detail, info } = self;
    return `${context.metadata.modelName}.${context.caller} -> ${type}::${detail.type} (${info.message})`;
  },

  toStatusCode: (self) => {
    const impl = getImplWithDowncast(self.detail.type);
    return impl.toStatusCode(self.detail);
  },

  toExposed: (self) => {
    const { context, detail: __detailRaw, ...rest } = self;
    const impl = getImplWithDowncast(__detailRaw.type);
    const detail = impl.toExposed(__detailRaw);
    return { ...rest, detail };
  },

} as const satisfies ErrorEntryImpl<DatabaseError>;

/// Utils ///

export type DatabaseResult<S, E extends DatabaseError = DatabaseError> = ResultAsync<S, E>;

export function databaseWrapResult<S>(fn: Promise<S>): ResultAsync<S, PrismaClientError> {
  return ResultAsync.fromPromise(fn, (e) => e as PrismaClientError);
}

export function databaseWrapBridgeResult<S>(fn: Promise<S>): ResultAsync<S, PrismaBridgeError> {
  return databaseWrapResult(fn)
    .mapErr(PrismaBridgeError.fromRawError2detail)
    .mapErr(PrismaBridgeError.create);
}

export type DatabaseErrorEntryImpl<E extends DatabaseError['detail']> =
  & {
    readonly type: E['type'];
    create: (detail: E['detail']) => E;
    getInfo: (metadata: ModelMetadata<any, 'CATCH_ALL'>) => (self: E) => DatabaseError['info'];
    toStatusCode: (self: E) => number;
    toExposed: (self: E) => object;
  }
  & Record<string, unknown>;
