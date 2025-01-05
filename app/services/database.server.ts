import type { DatabaseError, PrismaClientError } from '@/types/database';
import type { ModelMetadata } from '@/types/model';
import { clientKnownErrorCode } from '@/types/database';
import { getEntries } from '@/utils';
import { __Member } from '@/utils/models/member';
import { Prisma, type PrismaClient } from '@prisma/client';
import { ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

export class Database {
  public models;

  public constructor(protected client: PrismaClient) {
    this.models = {
      Member: __Member(client),
    };
  }

  public static transformError(
    metadata: ModelMetadata<any, 'CATCH_ALL'>,
    caller: string,
    error: unknown,
    { message, hint }: Partial<{ message: string; hint: string }> = {},
  ): DatabaseError {
    const detail
      = match(error)
        .when(
          (e) => e instanceof Prisma.PrismaClientKnownRequestError,
          (e) => {
            const type = getEntries(clientKnownErrorCode).find(([, code]) => code === e.code)?.[0] ?? 'UNKNOWN_REQUEST_ERROR' as const;
            return { type, _raw: e };
          },
        )
        .when(
          (e) => e instanceof Prisma.PrismaClientValidationError,
          (e) => ({ type: 'DATA_VALIDATION_FAILED' as const, _raw: e }),
        )
        .when(
          (e) => e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientUnknownRequestError,
          (e) => ({ type: 'UNKNOWN_REQUEST_ERROR' as const, _raw: e }),
        )
        .when(
          (e) => e instanceof Prisma.PrismaClientRustPanicError || e instanceof Prisma.PrismaClientInitializationError,
          (e) => ({ type: 'UNKNOWN_ERROR' as const, _raw: e }),
        )
        .otherwise(
          () => ({ type: 'UNEXPECTED_ERROR' as const, _raw: new Error('Unknown error', { cause: error }) }),
        );

    const _message
      = match(detail.type)
        .with('NO_ROWS_FOUND', () => `この${metadata.displayName}は見つかりませんでした`)
        .with('ALREADY_EXISTS', () => `この${metadata.displayName}は既に存在します`)
        .with('DATA_VALIDATION_FAILED', () => `この${metadata.displayName}のデータが不正です`)
        .otherwise(() => `${metadata.displayName}の処理中にエラーが発生しました`);

    return {
      metadata,
      caller,
      message: message ?? _message,
      hint,
      ...detail,
    };
  }

  public static transformResult<S>(fn: Promise<S>): ResultAsync<S, PrismaClientError> {
    return ResultAsync.fromPromise(fn, (e) => e as PrismaClientError);
  }
}
