import type { $Member } from '@/models/member';
import type { Nullable } from '@/types/utils';
import type { DatabaseResult } from '@/utils/errors/database';
import type { Prisma, PrismaClient } from '@prisma/client';

export interface ModelMetadata<
  M extends Uncapitalize<Prisma.ModelName>,
  V extends 'CATCH_ALL' | 'DEFAULT' = 'DEFAULT',
> {
  modelName: M;
  displayName: string;
  primaryKeyName: V extends 'CATCH_ALL' ? any : keyof PrismaClient[M]['fields'];
}

export type ModelMode = 'DEFAULT' | 'WITH_RESOLVED';
export type ModelVariants = Record<ModelMode, any>;
export type ModeWithDefault<Mode extends ModelMode, T> = Mode extends 'DEFAULT' ? T : never;
export type ModeWithResolved<Mode extends ModelMode, T> = Mode extends 'WITH_RESOLVED' ? T : undefined;

export type ModelResolver<
  Mode extends ModelMode,
  M extends AnyModel,
  MD = ExtractModelVariants<M>['WITH_RESOLVED'],
> = ModeWithDefault<Mode, DatabaseResult<MD>>;

export interface Model<
  Mode extends ModelMode,
  ModelGen extends AnyModelGenerator,
> {
  __raw: ModelGen extends ModelGenerator<any, infer SR, any, any, any> ? SR : never;
  data: ModelGen extends ModelGenerator<any, any, infer S, any, any> ? S : never;
  __rawResolved?: ModeWithResolved<Mode, ModelGen extends ModelGenerator<any, any, any, infer SR, any> ? SR : never>;
  dataResolved?: ModeWithResolved<Mode, ModelGen extends ModelGenerator<any, any, any, any, infer S> ? S : never>;

  resolveRelation?: () => any;
  update?: (...args: any[]) => DatabaseResult<AnyModel>;
  delete?: (...args: any[]) => DatabaseResult<void>;
}

export type ModelSerializer<
  M extends AnyModel,
> = (client: PrismaClient, builder: ModelBuilderType) => {
  schema: {
    fromRaw: (__raw: ModelSchemaRawOf<M>) => ModelSchemaOf<M>;
    toRaw: (data: ModelSchemaOf<M>) => ModelSchemaRawOf<M>;
  };
  schemaResolved: Nullable<{
    fromRaw: (__rawResolved: ModelSchemaResolvedRawOf<M>) => ModelSchemaResolvedOf<M>;
    toRaw: (data: ModelSchemaResolvedOf<M>) => ModelSchemaResolvedRawOf<M>;
  }>;
};

export interface ModelRawData4build<M extends AnyModel> { __raw: ModelSchemaRawOf<M>; __rawResolved: Nullable<ModelSchemaResolvedRawOf<M>> }

export type ModelBuilderType =
  | { type: 'ANONYMOUS' }
  | { type: 'SELF' }
  | { type: 'MEMBER'; member: $Member };

export interface ModelBuilder<
  M extends AnyModel,
> {
  __build: (args: ModelRawData4build<M>) => M;
  from: (...args: any[]) => DatabaseResult<ExtractModelVariants<M>['DEFAULT']>;
  fromWithResolved?: (...args: any[]) => DatabaseResult<ExtractModelVariants<M>['WITH_RESOLVED']>;
  findMany?: (args: FetchModelMany<ModelMetadataOf<M>['modelName']>) => DatabaseResult<Array<ExtractModelVariants<M>['DEFAULT']>>;
  findManyWithResolved?: (args: FetchModelMany<ModelMetadataOf<M>['modelName']>) => DatabaseResult<Array<ExtractModelVariants<M>['WITH_RESOLVED']>>;
  [key: string]: any;
}

export type FetchModelMany<
  M extends Uncapitalize<Prisma.ModelName>,
> = Omit<NonNullable<Parameters<PrismaClient[M]['findMany']>[0]>, 'include' | 'select'>;

// FIXME: これ `interface` にしたら型エラーになる.  なぜか.
// eslint-disable-next-line ts/consistent-type-definitions
export type RelatedResponseClearerInclude<
  I extends string,
> = { include: Record<Exclude<I, '_count'>, true> };

/**
 * __M = (client) => M のときの M
 */
export interface ModelGenerator<
  _Metadata extends ModelMetadata<any, 'CATCH_ALL'>,
  _SchemaRaw,
  _Schema,
  _SchemaResolvedRaw,
  _SchemaResolved,
> {
  // static methods //

  __prisma: PrismaClient;

  with: (client: PrismaClient) => any;
}

export type AnyModelGenerator = ModelGenerator<ModelMetadata<any, 'CATCH_ALL'>, any, any, any, any>;
export type AnyModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, AnyModelGenerator>;

/**
 * Model からファントムプロパティー `__struct` / `__variants` を抽出
 */
export type ExtractModelStruct<T>
  = T extends AnyModel & { __struct: infer S }
    ? S
    : never;

export type ExtractModelVariants<T>
  = T extends AnyModel & { __variants: infer V }
    ? V extends ModelVariants
      ? V
      : never
    : never;

export type ExtractModelGen<T>
  = T extends Model<any, infer G>
    ? G
    : never;

/**
 * M: Model<Mode, _> のときの Mode
 */
export type ModelModeOf<T extends AnyModel>
  = ExtractModelStruct<T> extends Model<infer M, any>
    ? M
    : never;

/**
 * M: Model<any, ModelGenerator<Metadata, ...>> のときの Metadata
 */
export type ModelMetadataOf<T extends AnyModel>
  = ExtractModelGen<ExtractModelStruct<T>> extends ModelGenerator<infer M, any, any, any, any>
    ? M
    : never;

/**
 * M: Model<any, ModelGenerator<_, SchemaRaw, ...>> のときの SchemaRaw
 */
export type ModelSchemaRawOf<T extends AnyModel>
  = ExtractModelGen<ExtractModelStruct<T>> extends ModelGenerator<any, infer SR, any, any, any>
    ? SR
    : never;

/**
 * M: Model<any, ModelGenerator<_, _, Schema, ...>> のときの Schema
 */
export type ModelSchemaOf<T extends AnyModel>
  = ExtractModelGen<ExtractModelStruct<T>> extends ModelGenerator<any, any, infer S, any, any>
    ? S
    : never;

/**
 * M: Model<any, ModelGenerator<_, _, _, SchemaResolvedRaw, ...>> のときの SchemaResolvedRaw
 */
export type ModelSchemaResolvedRawOf<T extends AnyModel>
  = ExtractModelGen<ExtractModelStruct<T>> extends ModelGenerator<any, any, any, infer SR, any>
    ? SR
    : never;

/**
 * M: Model<any, ModelGenerator<_, _, _, _, SchemaResolved>> のときの SchemaResolved
 */
export type ModelSchemaResolvedOf<T extends AnyModel>
  = ExtractModelGen<ExtractModelStruct<T>> extends ModelGenerator<any, any, any, any, infer S>
    ? S
    : never;
