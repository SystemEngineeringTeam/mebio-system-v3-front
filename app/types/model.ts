import type { Model } from '@/utils/model';
import type { Prisma, PrismaClient } from '@prisma/client';

export interface ModelMetadata<
  M extends Uncapitalize<Prisma.ModelName>,
  V extends 'CATCH_ALL' | 'DEFAULT' = 'DEFAULT',
> {
  modelName: M;
  displayName: string;
  primaryKeyName: V extends 'CATCH_ALL' ? any : keyof PrismaClient[M]['fields'];
}

/**
 * __M = (client) => M のときの M
 */
export type ModelGenerator<
  Metadata extends ModelMetadata<any, 'CATCH_ALL'>,
  SchemaRaw extends object,
  Schema extends object = SchemaRaw,
  SchemaResolved extends Schema = any,
> = (client: PrismaClient) => new (__raw: SchemaRaw) => Model<Metadata, SchemaRaw, Schema, SchemaResolved>;

export type AnyModelGenerator = ModelGenerator<ModelMetadata<any, 'CATCH_ALL'>, any>;
export type AnyModel = Model<any, object, object>;

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
 * M: Model<Metadata, SchemaRaw> のときの Metadata
 * ただし, __M = (client) => M のときの M に対しても適用可能
 */
export type ModelMetadataOf<T>
  = ModelEntityOf<T> extends Model<infer M, any>
    ? M
    : never;

/**
 * M: Model<Metadata, SchemaRaw> のときの Metadata
 * ただし, __M = (client) => M のときの M に対しても適用可能
 */
export type ModelSchemaRawOf<T>
  = ModelEntityOf<T> extends Model<any, infer S>
    ? S
    : never;

/**
 * M: Model<Metadata, SchemaRaw, Schema> のときの Schema
 * ただし, __M = (client) => M のときの M に対しても適用可能
 */
export type ModelSchemaOf<T>
  = ModelEntityOf<T> extends Model<any, any, infer S>
    ? S
    : never;

/**
 * M: Model<Metadata, SchemaRaw, Schema, SchemaResolved> のときの SchemaResolved
 * ただし, __M = (client) => M のときの M に対しても適用可能
 */
export type ModelSchemaResolvedOf<T>
  = ModelEntityOf<T> extends Model<any, any, any, infer S>
    ? S
    : never;
