import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { Nullable } from '@/types/utils';
import type { Prisma, PrismaClient } from '@prisma/client';
import type { Result } from 'neverthrow';

export interface ModelMetadata<
  M extends Uncapitalize<Prisma.ModelName>,
  V extends 'CATCH_ALL' | 'DEFAULT' = 'DEFAULT',
> {
  modelName: M;
  displayName: string;
  primaryKeyName: V extends 'CATCH_ALL' ? any : keyof PrismaClient[M]['fields'];
}

export type ModelMode = 'DEFAULT' | 'WITH_RESOLVED';
export type ModeWithDefault<Mode extends ModelMode, T> = Mode extends 'DEFAULT' ? T : never;
export type ModeWithResolved<Mode extends ModelMode, T> = Mode extends 'WITH_RESOLVED' ? T : undefined;

export interface Model<
  Mode extends ModelMode,
  ModelGen extends AnyModelGenerator,
> {
  __raw: ModelSchemaRawOf<ModelGen>;
  data: ModelSchemaOf<ModelGen>;
  __rawResolved?: ModeWithResolved<Mode, ModelSchemaResolvedRawOf<ModelGen>>;
  dataResolved?: ModeWithResolved<Mode, ModelSchemaResolvedOf<ModelGen>>;

  resolveRelation?: () => DatabaseResult<unknown>;
  update?: (...args: any[]) => DatabaseResult<AnyModel>;
  delete?: (...args: any[]) => DatabaseResult<void>;
}

export type ModelRawData4build<M> =
  M extends Model<any, ModelGenerator<any, infer SR, any, infer RR, any>>
    ? { __raw: SR; __rawResolved: Nullable<RR> }
    : never;

export type BuildModelError =
  | { type: 'PERMISSION_DENIED'; detail: { builder: ModelEntityOf<$Member> } };

export type BuildModelResult<S> = Result<S, BuildModelError>;

/**
 * __M = (client) => M のときの M
 */
export interface ModelGenerator<
  Metadata extends ModelMetadata<any, 'CATCH_ALL'>,
  SchemaRaw,
  Schema,
  SchemaResolvedRaw,
  SchemaResolved,
> {
  (client: PrismaClient): {

    // static methods //

    __prisma: PrismaClient;

    __build: ((
      _rawData: { __raw: SchemaRaw },
      builder?: any // FIXME: any を `ModelEntityOf<$Member>` に縛る
    ) => BuildModelResult<Model<'DEFAULT', ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>>) & ((
      _rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw },
      builder?: any // FIXME: any を `ModelEntityOf<$Member>` に縛る
    ) => BuildModelResult<Model<'WITH_RESOLVED', ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>>) & (<M extends ModelMode>(
      _rawData: { __raw: SchemaRaw; __rawResolved?: SchemaResolvedRaw },
      builder?: any // FIXME: any を `ModelEntityOf<$Member>` に縛る
    ) => BuildModelResult<Model<M, ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>>);

    from: (id: any) => DatabaseResult<{
      buildBy: (builder: any /* FIXME: any を `ModelEntityOf<$Member>` に縛る */) => BuildModelResult<Model<'DEFAULT', ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>>;
      buildBySelf: () => BuildModelResult<Model<'DEFAULT', ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>>;
    }>;
    fromWithResolved: (id: any) => DatabaseResult<{
      buildBy: (builder: any /* FIXME: any を `ModelEntityOf<$Member>` に縛る */) => BuildModelResult<Model<'WITH_RESOLVED', ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>>;
      buildBySelf: () => BuildModelResult<Model<'WITH_RESOLVED', ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>>;
    }>;
  };
}

export type AnyModelGenerator = ModelGenerator<ModelMetadata<any, 'CATCH_ALL'>, any, any, any, any>;
export type AnyModel = Model<any, AnyModelGenerator>;

// ref: https://stackoverflow.com/a/74657881
type InstanceTypeSpy<TClass> = InstanceType<{ new(): never } & TClass>;

/**
 * __M = (client) => M のときの M のインスタンス
 * ただし, M 単体のときでも適用可能
 */
export type ModelEntityOf<T>
  = T extends AnyModelGenerator
  /*
    NOTE:
      `Model` はファクトリーパターンを採用するために, コンストラクタのアクセス修飾子を `private` した.
      そのため, `InstanceType<T>` の `T` の制約 `abstract new (...args: any) => any` を満たすための `public` なコンストラクタを失ったために
      インスタンス化後の型を推論できなくなった.  なのでワークアラウンドとして `InstanceTypeSpy` を適用した.
   */
    ? InstanceTypeSpy<ReturnType<T>>
    : T extends AnyModel
      ? T
      : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw> のときの Mode
 */
export type ModelEntityModeOf<T>
  = T extends Model<infer M, any>
    ? M
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw> のときの Metadata
 */
export type ModelMetadataOf<T>
  = T extends ModelGenerator<infer M, any, any, any, any>
    ? M
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw> のときの SchemaRaw
 */
export type ModelSchemaRawOf<T>
  = T extends ModelGenerator<any, infer SR, any, any, any>
    ? SR
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw, Schema> のときの Schema
 */
export type ModelSchemaOf<T>
  = T extends ModelGenerator<any, any, infer S, any, any>
    ? S
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw, Schema, SchemaResolvedRaw> のときの S
 */
export type ModelSchemaResolvedRawOf<T>
  = T extends ModelGenerator<any, any, any, infer RR, any>
    ? RR
    : never;

/**
 * M: ModelGenerator<Mode, Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> のときの S
 */
export type ModelSchemaResolvedOf<T>
  = T extends ModelGenerator<any, any, any, any, infer R>
    ? R
    : never;
