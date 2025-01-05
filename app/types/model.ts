import type { Model } from '@/utils/model';
import type { Prisma, PrismaClient } from '@prisma/client';

export interface ModelMetadata<
  M extends Prisma.ModelName,
  V extends 'CATCH_ALL' | 'DEFAULT' = 'DEFAULT',
> {
  modelName: M;
  displayName: string;
  primaryKeyName: V extends 'CATCH_ALL' ? any : keyof PrismaClient[Uncapitalize<M>]['fields'];
}

// __M = (client) => M のときの M
export type ModelGenerator<
  Metadata extends ModelMetadata<any, 'CATCH_ALL'>,
  Schema extends object,
> = (client: PrismaClient) => new (data: Schema) => Model<Metadata, Schema>;

export type AnyModelGenerator = ModelGenerator<ModelMetadata<any, 'CATCH_ALL'>, any>;
export type AnyModel = Model<any, any>;

// __M = (client) => M のときの M
// ただし, __M = (client) => M のときの M に対しても適用可能
export type ModelEntityOf<T extends AnyModelGenerator | AnyModel>
  = T extends AnyModelGenerator
    ? InstanceType<ReturnType<T>>
    : T extends AnyModel
      ? T
      : never;

// M: Model<Metadata, Schema> のときの Metadata
// ただし, __M = (client) => M のときの M に対しても適用可能
export type ModelMetadataOf<T extends AnyModelGenerator | AnyModel>
  = ModelEntityOf<T> extends Model<infer M, any>
    ? M
    : never;

// M: Model<Metadata, Schema> のときの Metadata
// ただし, __M = (client) => M のときの M に対しても適用可能
export type ModelSchemaOf<T extends AnyModelGenerator | AnyModel>
  = ModelEntityOf<T> extends Model<any, infer S>
    ? S
    : never;
