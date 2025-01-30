import type { Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMetadataOf, ModelSchemaRawOf, ModelSchemaResolvedOf, ModelSchemaResolvedRawOf } from '@/types/model';
import type { Override } from '@/types/utils';

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

// eslint-disable-next-line func-style
const __TestModel: ModelGenerator<typeof _metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>
  = (_client) => null as any;

type $TestModel = typeof __TestModel;

describe('モデルまわりの Type Utilities', () => {
  it('エンティティを取得できる', () => {
    expectTypeOf<ModelEntityOf<$TestModel>>().toEqualTypeOf<Model<typeof _metadata, SchemaRaw, Schema, SchemaResolved>>();
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
