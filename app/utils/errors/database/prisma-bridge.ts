import type { DatabaseErrorEntryImpl } from '@/utils/errors/database';
import { getEntries } from '@/utils';
import { Prisma } from '@prisma/client';
import { match } from 'ts-pattern';

export const clientKnownErrorCode = {
  ALREADY_EXISTS: 'P2002',
  NO_ROWS_FOUND: 'P2025',
} as const satisfies Record<string, string>;

// ref: https://www.prisma.io/docs/orm/reference/error-reference
export type PrismaClientError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientRustPanicError
  | Prisma.PrismaClientInitializationError
  | Error;

export interface PrismaBridgeError {
  type: 'PRISMA_BRIDGE_ERROR';
  detail:
    | {
      type: keyof typeof clientKnownErrorCode | 'UNKNOWN_REQUEST_ERROR';
      _raw: Prisma.PrismaClientKnownRequestError;
    }
    | {
      type: 'DATA_VALIDATION_FAILED';
      _raw: Prisma.PrismaClientValidationError;
    }
    | {
      type: 'UNKNOWN_REQUEST_ERROR';
      _raw: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError;
    }
    | {
      type: 'UNKNOWN_ERROR';
      _raw: Prisma.PrismaClientRustPanicError | Prisma.PrismaClientInitializationError;
    }
    | {
      type: 'UNEXPECTED_ERROR';
      _raw: Error;
    };
}

export const PrismaBridgeError = {
  type: 'PRISMA_BRIDGE_ERROR',

  create(detail) {
    return ({ type: this.type, detail } as const satisfies PrismaBridgeError);
  },

  getInfo: (metadata) => (self) => match(self.detail)
    .with({ type: 'NO_ROWS_FOUND' }, () => ({
      message: `この${metadata.displayName}は見つかりませんでした`,
      hint: undefined,
    }))
    .with({ type: 'ALREADY_EXISTS' }, () => ({
      message: `この${metadata.displayName}は既に存在します`,
      hint: undefined,
    }))
    .with({ type: 'DATA_VALIDATION_FAILED' }, () => ({
      message: `この${metadata.displayName}のデータが不正です`,
      hint: undefined,
    }))
    .otherwise(() => ({
      message: `${metadata.displayName}のデータ処理中にエラーが発生しました`,
      hint: undefined,
    })),

  fromRawError2detail: (error: unknown): PrismaBridgeError['detail'] => match(error)
    .returnType<PrismaBridgeError['detail']>()
    .when(
      (e) => e instanceof Prisma.PrismaClientKnownRequestError,
      (e) => ({
        type: getEntries(clientKnownErrorCode).find(([, code]) => code === e.code)?.[0] ?? 'UNKNOWN_REQUEST_ERROR',
        _raw: e,
      }),
    )
    .when(
      (e) => e instanceof Prisma.PrismaClientValidationError,
      (e) => ({ type: 'DATA_VALIDATION_FAILED', _raw: e }),
    )
    .when(
      (e) => e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientUnknownRequestError,
      (e) => ({ type: 'UNKNOWN_REQUEST_ERROR', _raw: e }),
    )
    .when(
      (e) => e instanceof Prisma.PrismaClientRustPanicError || e instanceof Prisma.PrismaClientInitializationError,
      (e) => ({ type: 'UNKNOWN_ERROR', _raw: e }),
    )
    .otherwise(
      () => ({ type: 'UNEXPECTED_ERROR', _raw: new Error('Unknown error', { cause: error }) }),
    ),

  toStatusCode: (self) => match(self.detail.type)
    .with('NO_ROWS_FOUND', () => 404)
    .with('ALREADY_EXISTS', () => 409)
    .with('DATA_VALIDATION_FAILED', () => 400)
    .otherwise(() => 500),

  toExposed: (self) => {
    const { type, detail: { type: _type } } = self;
    return { type, detail: { type: _type } };
  },

} as const satisfies DatabaseErrorEntryImpl<PrismaBridgeError>;
