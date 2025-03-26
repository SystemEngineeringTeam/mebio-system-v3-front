import type { $Member } from '@/models/member';
import type { DatabaseErrorWith, DatabaseResult } from '@/types/database';
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
export type ModelVariants = Record<ModelMode, any>;
export type ModeWithDefault<Mode extends ModelMode, T> = Mode extends 'DEFAULT' ? T : never;
export type ModeWithResolved<Mode extends ModelMode, T> = Mode extends 'WITH_RESOLVED' ? T : undefined;

export type ModelResolver<
  Mode extends ModelMode,
  M extends AnyModel,
> = ModeWithDefault<
  Mode,
  ReturnType<NonNullable<ModelBuilder<M>['fromWithResolved']>>
>;

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

export type ModelNormalizer<
  M extends AnyModel,
> = (client: PrismaClient, builder: ModelBuilderType) => {
  schema: (__raw: ModelSchemaRawOf<M>) => ModelSchemaOf<M>;
  schemaResolved: (__rawResolved: ModelSchemaResolvedRawOf<M>) => ModelSchemaResolvedOf<M>;
};

export interface ModelRawData4build<M extends AnyModel<ModelMode>> { __raw: ModelSchemaRawOf<M>; __rawResolved: Nullable<ModelSchemaResolvedRawOf<M>> }

export type ModelBuilderType =
  | { type: 'ANONYMOUS' }
  | { type: 'SELF' }
  | { type: 'MEMBER'; member: $Member };
export type BuildModelResult<S> = Result<S, DatabaseErrorWith<'MODEL_BUILD_ERROR'>>;

export type ModelUnwrappedInstances__DO_NOT_EXPOSE<
  M extends AnyModel,
  V extends ModelVariants = ExtractModelVariants<M>,
> = (
  rawData: ModelRawData4build<V['DEFAULT']>,
  builder: ModelBuilderType,
) => { default: V['DEFAULT']; withResolved: V['WITH_RESOLVED'] };

export type ModelInstances<
  M extends AnyModel,
> = (
  ...args: Parameters<ModelUnwrappedInstances__DO_NOT_EXPOSE<M>>
) => BuildModelResult<ReturnType<ModelUnwrappedInstances__DO_NOT_EXPOSE<M>>>;

export interface ModelBuilderInternal<
  M extends AnyModel,
> {
  __with: ModelInstances<M>;
  by: (rawData: ModelRawData4build<M>, memberAsBuilder: $Member) => ReturnType<ModelInstances<M>>;
  bySelf: (rawData: ModelRawData4build<M>) => ReturnType<ModelInstances<M>>;
  [key: string]: any;
}

interface ModelBuilderInternalReturns<
  M extends AnyModel,
  Mode extends ModelMode,
  VV = ExtractModelVariants<M>[Mode],
> {
  build: (builder: ModelBuilderType) => BuildModelResult<VV>;
  buildBy: (memberAsBuilder: $Member) => BuildModelResult<VV>;
  buildBySelf: () => BuildModelResult<VV>;
}

interface ModelBuilderInternalArrayReturns<
  M extends AnyModel,
  Mode extends ModelMode,
  VV = ExtractModelVariants<M>[Mode],
> {
  build: (builder: ModelBuilderType) => Array<BuildModelResult<VV>>;
  buildBy: (memberAsBuilder: $Member) => Array<BuildModelResult<VV>>;
  buildBySelf: () => Array<BuildModelResult<VV>>;
}

export interface ModelBuilder<
  M extends AnyModel,
> {
  __build: ModelBuilderInternal<M>;
  from: (...args: any[]) => DatabaseResult<ModelBuilderInternalReturns<M, 'DEFAULT'>>;
  fromWithResolved?: (...args: any[]) => DatabaseResult<ModelBuilderInternalReturns<M, 'WITH_RESOLVED'>>;
  fetchMany?: (args: FetchModelMany<ModelMetadataOf<M>['modelName']>) => DatabaseResult<ModelBuilderInternalArrayReturns<M, 'DEFAULT'>>;
  fetchManyWithResolved?: (args: FetchModelMany<ModelMetadataOf<M>['modelName']>) => DatabaseResult<ModelBuilderInternalArrayReturns<M, 'WITH_RESOLVED'>>;
  [key: string]: any;
}

export type FetchModelMany<
  M extends Uncapitalize<Prisma.ModelName>,
> = Omit<NonNullable<Parameters<PrismaClient[M]['findMany']>[0]>, 'include' | 'select'>;

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
