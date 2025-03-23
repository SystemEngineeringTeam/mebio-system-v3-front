import type { ModelMetadata } from '@/types/model';
import type { PartialNullable } from '@/types/utils';
import { $Member } from '@/models/member';
import { $MemberActive } from '@/models/member/active';
import { $MemberActiveExternal } from '@/models/member/active/external';
import { $MemberActiveInternal } from '@/models/member/active/internal';
import { $MemberAlumni } from '@/models/member/alumni';
import { $MemberBase } from '@/models/member/base';
import { $MemberSensitive } from '@/models/member/sensitive';
import { $MemberStatus } from '@/models/member/status';
import { $Payment } from '@/models/payment';
import { $Snapshot } from '@/models/snapshot';
import { clientKnownErrorCode, type DatabaseError, type DatabaseErrorWith, type PrismaBridgeErrorDetail, type PrismaClientError } from '@/types/database';
import { getEntries } from '@/utils';
import { Prisma, type PrismaClient } from '@prisma/client';
import { ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

export class Database {
  public models;

  public constructor(protected client: PrismaClient) {
    this.models = {
      Member: $Member.with(client),
      member: {
        Status: $MemberStatus.with(client),
        Base: $MemberBase.with(client),
        Sensitive: $MemberSensitive.with(client),
        Active: $MemberActive.with(client),
        active: {
          Internal: $MemberActiveInternal.with(client),
          External: $MemberActiveExternal.with(client),
        },
        Alumni: $MemberAlumni.with(client),
      },
      Payment: $Payment.with(client),
      Snapshot: $Snapshot.with(client),
    };
  }

  public static createError<
    V extends DatabaseError['error']['type'] = DatabaseError['error']['type'],
  >(
    metadata: ModelMetadata<any, 'CATCH_ALL'>,
    caller: string,
    error: DatabaseErrorWith<V>['error'],
    { message, hint }: PartialNullable<{ message: string; hint: string }> = {},
  ): DatabaseErrorWith<V> {
    const _default = match(error as DatabaseError['error'])
      .returnType<{ message: string; hint?: string }>()
      .with(
        { type: 'PRISMA_BRIDGE_ERROR' },
        ({ detail }) => match(detail)
          .with({ type: 'NO_ROWS_FOUND' }, () => ({ message: `この${metadata.displayName}は見つかりませんでした` }))
          .with({ type: 'ALREADY_EXISTS' }, () => ({ message: `この${metadata.displayName}は既に存在します` }))
          .with({ type: 'DATA_VALIDATION_FAILED' }, () => ({ message: `この${metadata.displayName}のデータが不正です` }))
          .otherwise(() => ({ message: `${metadata.displayName}のデータの処理中にエラーが発生しました` })),
      )
      .with(
        { type: 'MODEL_BUILD_ERROR' },
        ({ detail }) => match(detail)
          .with({ type: 'PERMISSION_DENIED' }, () => ({ message: `この${metadata.displayName}に対する権限がありません` }))
          .otherwise(() => ({ message: `この${metadata.displayName}の処理中にエラーが発生しました` })),
      )
      .otherwise(() => ({ message: `この${metadata.displayName}の処理中にエラーが発生しました` }));

    return {
      metadata,
      caller,
      message: message ?? _default.message,
      hint: hint ?? _default.hint,
      error,
    };
  }

  public static transformPrismaBridgeError(
    metadata: ModelMetadata<any, 'CATCH_ALL'>,
    caller: string,
    error: unknown,
    { message, hint }: PartialNullable<{ message: string; hint: string }> = {},
  ): DatabaseErrorWith<'PRISMA_BRIDGE_ERROR'> {
    const detail
      = match(error)
        .returnType<PrismaBridgeErrorDetail>()
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
        );

    return Database.createError(metadata, caller, { type: 'PRISMA_BRIDGE_ERROR', detail }, { message, hint });
  }

  public static transformBuildBridgeError(
    metadata: ModelMetadata<any, 'CATCH_ALL'>,
    caller: string,
    error: DatabaseErrorWith<'MODEL_BUILD_ERROR'>['error']['detail'],
    { message, hint }: PartialNullable<{ message: string; hint: string }> = {},
  ): DatabaseErrorWith<'MODEL_BUILD_ERROR'> {
    return Database.createError(metadata, caller, { type: 'MODEL_BUILD_ERROR', detail: error }, { message, hint });
  }

  public static unwrapToResponse(error: DatabaseError): never {
    const status = match(error.error)
      .with(
        { type: 'PRISMA_BRIDGE_ERROR' },
        ({ detail }) => match(detail.type)
          .with('NO_ROWS_FOUND', () => 404)
          .with('ALREADY_EXISTS', () => 409)
          .with('DATA_VALIDATION_FAILED', () => 400)
          .otherwise(() => 500),
      )
      .with(
        { type: 'MODEL_BUILD_ERROR' },
        ({ detail }) => match(detail.type)
          .with('PERMISSION_DENIED', () => 403)
          .otherwise(() => 500),
      )
      .otherwise(() => 500);

    throw new Response(JSON.stringify(error), { status });
  }

  public static transformResult<S>(fn: Promise<S>): ResultAsync<S, PrismaClientError> {
    return ResultAsync.fromPromise(fn, (e) => e as PrismaClientError);
  }

  public static dbErrorWith(metadata: ModelMetadata<any, 'CATCH_ALL'>) {
    type CreateRest = Parameters<typeof Database.createError> extends [any, any, ...infer R] ? R : never;
    type TransformPrismaBridgeRest = Parameters<typeof Database.transformPrismaBridgeError> extends [any, any, ...infer R] ? R : never;
    type TransformBuildModelRest = Parameters<typeof Database.transformBuildBridgeError> extends [any, any, ...infer R] ? R : never;

    return {
      /**
       * {@link Database.createError} の部分適用.
       */
      create: (caller: string) => (...rest: CreateRest) => Database.createError(metadata, caller, ...rest),

      /**
       * {@link Database.transformPrismaBridgeError} の部分適用.
       */
      transformPrismaBridge: (caller: string) => (...rest: TransformPrismaBridgeRest) => Database.transformPrismaBridgeError(metadata, caller, ...rest),

      /**
       * {@link Database.transformBuildModelError} の部分適用.
       */
      transformBuildModel: (caller: string) => (...rest: TransformBuildModelRest) => Database.transformBuildBridgeError(metadata, caller, ...rest),
    };
  }
}
