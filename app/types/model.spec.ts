import type { Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMetadataOf, ModelMode, ModelModeOf, ModelSchemaRawOf, ModelSchemaResolvedOf, ModelSchemaResolvedRawOf } from '@/types/model';
import type { Override } from '@/types/utils';
import type { PrismaClient } from '@prisma/client';

interface SchemaRaw {
  a: symbol;
  b: symbol;
}

type Schema = Override<SchemaRaw, {
  b: symbol;
}>;

interface SchemaResolvedRaw {
  C: symbol;
}

interface SchemaResolved {
  _parent: {
    C: symbol;
  };
}

const _metadata = {
  displayName: '表示名',
  modelName: 'モデル名',
  primaryKeyName: 'プライマリキー名',
} as const satisfies ModelMetadata<any, 'CATCH_ALL'>;

// eslint-disable-next-line func-style, antfu/top-level-function
const __TestModel = <M extends ModelMode = 'DEFAULT'>(_client: PrismaClient) => class Member<_Mode extends ModelMode = M> {
  // empty
};

export type $TestModel<M extends ModelMode = 'DEFAULT'> = typeof __TestModel<M> & ModelGenerator<M, typeof _metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

describe('モデルまわりの Type Utilities', () => {
  it('モデルの状態を取得できる', () => {
    expectTypeOf<ModelModeOf<$TestModel>>().toEqualTypeOf<'DEFAULT'>();
  });
  it('エンティティを取得できる', () => {
    expectTypeOf<ModelEntityOf<$TestModel>>().toEqualTypeOf<Model<'DEFAULT', typeof _metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>>();
  });
  it('メタデータを取得できる', () => {
    expectTypeOf<ModelMetadataOf<$TestModel>>().toEqualTypeOf<typeof _metadata>();
  });
  it('生スキーマを取得できる', () => {
    expectTypeOf<ModelSchemaRawOf<$TestModel>>().toEqualTypeOf<SchemaRaw>();
  });
  it('解決済み生スキーマを取得できる', () => {
    expectTypeOf<ModelSchemaResolvedRawOf<$TestModel>>().toEqualTypeOf<SchemaResolvedRaw>();
  });
  it('解決済みスキーマを取得できる', () => {
    expectTypeOf<ModelSchemaResolvedOf<$TestModel>>().toEqualTypeOf<SchemaResolved>();
  });
});
