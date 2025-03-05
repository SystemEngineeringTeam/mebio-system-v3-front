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

export type ModelResolver<
  Mode extends ModelMode,
  M extends AnyModel,
  MR = Model<'WITH_RESOLVED', ExtractModelGen<M>>,
> = ModeWithDefault<
  Mode,
  DatabaseResult<
    {
      buildBy: (builder: M) => BuildModelResult<MR>;
      buildBySelf: () => BuildModelResult<MR>;
    }
  >
>;

export interface Model<
  Mode extends ModelMode,
  ModelGen extends AnyModelGenerator,
> {
  __raw: ModelGen extends ModelGenerator<any, infer SR, any, any, any> ? SR : never;
  data: ModelGen extends ModelGenerator<any, any, infer S, any, any> ? S : never;
  __rawResolved?: ModeWithResolved<Mode, ModelGen extends ModelGenerator<any, any, any, infer SR, any> ? SR : never>;
  dataResolved?: ModeWithResolved<Mode, ModelGen extends ModelGenerator<any, any, any, any, infer S> ? S : never>;

  resolveRelation?: () => ModelResolver<Mode, any>;
  update?: (...args: any[]) => DatabaseResult<AnyModel>;
  delete?: (...args: any[]) => DatabaseResult<void>;
}

export interface ModelRawData4build<M extends AnyModel> { __raw: ModelSchemaRawOf<M>; __rawResolved: Nullable<ModelSchemaResolvedRawOf<M>> }
export type BuildModelError =
  | { type: 'PERMISSION_DENIED'; detail: { builder: $Member } };

export type BuildModelResult<S> = Result<S, BuildModelError>;

export interface ModelBuilderInternal<
  M extends AnyModel,
  MD = Model<'DEFAULT', ExtractModelGen<M>>,
  MR = Model<'WITH_RESOLVED', ExtractModelGen<M>>,
> {
  __build: (
    rawData: ModelRawData4build<M>,
    builder: $Member
  ) => BuildModelResult<{
    default: MD;
    withResolved: MR;
  }>;
  __buildBySelf: (
    rawData: ModelRawData4build<M>
  ) => BuildModelResult<{
    default: MD;
    withResolved: MR;
  }>;
}

export type ModelBuilder<
  M extends AnyModel,
  MD = Model<'DEFAULT', ExtractModelGen<M>>,
  MR = Model<'WITH_RESOLVED', ExtractModelGen<M>>,
> = ModelBuilderInternal<M> & {
  from: (...args: any[]) => DatabaseResult<{
    buildBy: (builder: $Member) => BuildModelResult<MD>;
    buildBySelf: () => BuildModelResult<MD>;
  }>;
  fromWithResolved: (...args: any[]) => DatabaseResult<{
    buildBy: (builder: $Member) => BuildModelResult<MR>;
    buildBySelf: () => BuildModelResult<MR>;
  }>;
};

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

  with: <M extends AnyModel>(client: PrismaClient) => ModelBuilder<M>;
}

export type AnyModelGenerator = ModelGenerator<ModelMetadata<any, 'CATCH_ALL'>, any, any, any, any>;
export type AnyModel = Model<any, AnyModelGenerator>;

/**
 * Model からファントムプロパティー `__struct` を抽出
 */
type ExtractModelStruct<T>
  = T extends AnyModel & { __struct: infer S }
    ? S
    : never;

type ExtractModelGen<T>
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
