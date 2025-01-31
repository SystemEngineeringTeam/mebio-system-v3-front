import type { DatabaseResult } from '@/types/database';
import type { Nullable } from '@/types/utils';
import type { Prisma, PrismaClient } from '@prisma/client';

export interface ModelMetadata<
  M extends Uncapitalize<Prisma.ModelName>,
  V extends 'CATCH_ALL' | 'DEFAULT' = 'DEFAULT',
> {
  modelName: M;
  displayName: string;
  primaryKeyName: V extends 'CATCH_ALL' ? any : keyof PrismaClient[M]['fields'];
}

export interface Model<
  _Metadata extends NoInfer<ModelMetadata<any, 'CATCH_ALL'>>,
  SchemaRaw extends object = any,
  Schema extends object = SchemaRaw,
  SchemaResolvedRaw extends object = any,
  SchemaResolved extends object = SchemaResolvedRaw,
> {
  data: Schema;

  resolveRelation?: () => DatabaseResult<unknown>;
  update?: (...args: any[]) => DatabaseResult<AnyModel>;
  delete?: (...args: any[]) => DatabaseResult<void>;
}

/**
 * __M = (client) => M のときの M
 */
export type ModelGenerator<
  Metadata extends ModelMetadata<any, 'CATCH_ALL'> = any,
  SchemaRaw extends object = any,
  Schema extends object = SchemaRaw,
  SchemaResolvedRaw extends object = any,
  SchemaResolved extends object = SchemaResolvedRaw,
> = (client: PrismaClient) => {
  new(__raw: SchemaRaw): Model<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

  // static methods //

  __prisma: PrismaClient;
  from: (id: any) => DatabaseResult<Model<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>;
  fromWithResolved: (id: any) => DatabaseResult<Model<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>;
};

export type ModelMode = 'DEFAULT' | 'WITH_RESOLVED';
export type AnyModelGenerator = ModelGenerator<ModelMetadata<any, 'CATCH_ALL'>, any, any, any, any>;
export type AnyModel = Model<ModelMetadata<any, 'CATCH_ALL'>, any, any, any, any>;

export type ModeWithDefault<Mode extends ModelMode, T> = Mode extends 'DEFAULT' ? T : never;
export type ModeWithResolved<Mode extends ModelMode, T> = Mode extends 'WITH_RESOLVED' ? T : Nullable;

/**
 * __M = (client) => M のときの M のインスタンス
 * ただし, M 単体のときでも適用可能
 */
export type ModelEntityOf<T>
  = T extends AnyModelGenerator
    ? InstanceType<ReturnType<T>>
    : T extends AnyModel
      ? T
      : never;

/**
 * M: ModelGenerator<Metadata, SchemaRaw> のときの Metadata
 */
export type ModelMetadataOf<T>
  = T extends ModelGenerator<infer M, any, any, any, any>
    ? M
    : never;

/**
 * M: ModelGenerator<Metadata, SchemaRaw> のときの SchemaRaw
 */
export type ModelSchemaRawOf<T>
  = T extends ModelGenerator<any, infer SR, any, any, any>
    ? SR
    : never;

/**
 * M: ModelGenerator<Metadata, SchemaRaw, Schema> のときの Schema
 */
export type ModelSchemaOf<T>
  = T extends ModelGenerator<any, any, infer S, any, any>
    ? S
    : never;

/**
 * M: ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw> のときの S
 */
export type ModelSchemaResolvedRawOf<T>
  = T extends ModelGenerator<any, any, any, infer RR, any>
    ? RR
    : never;

/**
 * M: ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> のときの S
 */
export type ModelSchemaResolvedOf<T>
  = T extends ModelGenerator<any, any, any, any, infer R>
    ? R
    : never;
