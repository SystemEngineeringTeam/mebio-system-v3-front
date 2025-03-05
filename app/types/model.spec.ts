import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelEntityModeOf, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMetadataOf, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModelSchemaResolvedOf, ModelSchemaResolvedRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type { PrismaClient } from '@prisma/client';
import { ok } from 'neverthrow';

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

type ModelGen = ModelGenerator<typeof _metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, ModelGen>;
type RawData = ModelRawData4build<ThisModel>;

export const __TestModel = (<Mode extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class TestModel implements ThisModel<Mode> {
  public static __prisma = client;

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  private constructor(_rawData: RawData, _builder?: ModelEntityOf<$Member>) {
    this.__raw = {} as SchemaRaw;
    this.data = {} as Schema;
    this.__rawResolved = {} as ModeWithResolved<Mode, SchemaResolvedRaw>;
    this.dataResolved = {} as ModeWithResolved<Mode, SchemaResolved>;
  }

  public static __build(rawData: { __raw: SchemaRaw }, builder?: any): BuildModelResult<ThisModel<'DEFAULT'>>;
  public static __build(rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw }, builder?: any): BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
  public static __build<M extends ModelMode>(rawData: { __raw: SchemaRaw; __rawResolved?: SchemaResolvedRaw }, builder?: any): BuildModelResult<ThisModel<M>> {
    const Model = __TestModel<M>(client);
    return ok(new Model(rawData, builder));
  }

  public static from(_id: any) {
    return {} as ReturnType<ReturnType<ModelGen>['from']>;
  }

  public static fromWithResolved(_id: any) {
    return {} as ReturnType<ReturnType<ModelGen>['fromWithResolved']>;
  }

  public resolveRelation(): ModeWithDefault<Mode, DatabaseResult<ThisModel<'WITH_RESOLVED'>>> {
    throw new Error();
  }

  public update(_data: Partial<Schema>): DatabaseResult<ThisModel> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGen;

export type $TestModel<M extends ModelMode = 'DEFAULT'> = ModelGen & typeof __TestModel<M>;

describe('モデルまわりの Type Utilities', () => {
  it('`__build` の第 1 引数内のオブジェクトによって, `DEFAULT` や `WITH_RESOLVED` が推論されるか.', () => {
    const TestModel = __TestModel({} as PrismaClient);
    const modelDefault = TestModel.__build({ __raw: {} as SchemaRaw })._unsafeUnwrap();
    const modelWithResolved = TestModel.__build({ __raw: {} as SchemaRaw, __rawResolved: {} as SchemaResolvedRaw })._unsafeUnwrap();

    expectTypeOf(modelDefault.dataResolved).toEqualTypeOf<undefined>();
    expectTypeOf(modelWithResolved.dataResolved).toEqualTypeOf<SchemaResolved>();
  });
  it('モデルエンティティのモードを取得できる', () => {
    const TestModel = __TestModel({} as PrismaClient);
    const modelDefault = TestModel.__build({ __raw: {} as SchemaRaw })._unsafeUnwrap();
    const modelWithResolved = TestModel.__build({ __raw: {} as SchemaRaw, __rawResolved: {} as SchemaResolvedRaw })._unsafeUnwrap();

    expectTypeOf<ModelEntityModeOf<typeof modelDefault>>().toEqualTypeOf<'DEFAULT'>();
    expectTypeOf<ModelEntityModeOf<typeof modelWithResolved>>().toEqualTypeOf<'WITH_RESOLVED'>();
  });
  it('エンティティを取得できる', () => {
    type ModelDefault = ModelEntityOf<$TestModel>;
    type ModelWithResolved = ModelEntityOf<$TestModel<'WITH_RESOLVED'>>;

    expectTypeOf<ModelEntityOf<ModelDefault>['data']>().toEqualTypeOf<Schema>();
    expectTypeOf<ModelEntityOf<ModelDefault>['dataResolved']>().toEqualTypeOf<undefined>();
    expectTypeOf<ReturnType<ModelEntityOf<ModelDefault>['resolveRelation']>>().toEqualTypeOf<DatabaseResult<ThisModel<'WITH_RESOLVED'>>>();

    expectTypeOf<ModelEntityOf<ModelWithResolved>['data']>().toEqualTypeOf<Schema>();
    expectTypeOf<ModelEntityOf<ModelWithResolved>['dataResolved']>().toEqualTypeOf<SchemaResolved>();
    expectTypeOf<ReturnType<ModelEntityOf<ModelWithResolved>['resolveRelation']>>().toEqualTypeOf<never>();
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
