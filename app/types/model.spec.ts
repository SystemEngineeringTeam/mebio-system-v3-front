import type { $Member } from '@/models/member';
import type { Model, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMetadataOf, ModelMode, ModelModeOf, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelSchemaResolvedOf, ModelSchemaResolvedRawOf, ModelSerializer, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  PrismaClient,
} from '@prisma/client';
import { matchWithResolved } from '@/utils/model';
import { ok } from 'neverthrow';

const _metadata = {
  displayName: 'テストモデル',
  modelName: 'member',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'member'>;

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

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof _metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $TestModel<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
type RawData = ModelRawData4build<ThisModel>;

/// Normalizer ///

const normalizer = ((_, __) => ({
  schema: (__raw) => ({} as Schema),
  schemaResolved: (__rawResolved) => ({} as SchemaResolved),
})) satisfies ModelSerializer<ThisModel>;

/// Model ///

export class $TestModel<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
  public declare __struct: ThisModelImpl<Mode>;
  public declare __variants: ThisModelVariants;

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  private constructor(
    public __prisma: PrismaClient,
    { __raw, __rawResolved }: RawData,
    private builder: ModelBuilderType,
  ) {
    const n = normalizer(__prisma, this.builder);

    this.__raw = __raw;
    this.data = n.schema(__raw);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(__rawResolved, n.schemaResolved);
    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static with(client: PrismaClient) {
    const __toUnwrappedInstances = ((rawData, builder) => ({
      default: new $TestModel(client, rawData, builder),
      withResolved: new $TestModel<'WITH_RESOLVED'>(client, rawData, builder),
    })) satisfies ModelUnwrappedInstances__DO_NOT_EXPOSE<ThisModel>;

    const toInstances = (
      (rawData, builder) => ok(__toUnwrappedInstances(rawData, builder))
    ) satisfies ModelInstances<ThisModel>;

    const __build = {
      __with: toInstances,
      by: (rawData, memberAsBuilder) => toInstances(rawData, { type: 'MEMBER', member: memberAsBuilder }),
      bySelf: (rawData) => toInstances(rawData, { type: 'SELF' }),
    } satisfies ModelBuilderInternal<ThisModel>;

    return { __build };
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    throw new Error('Method not implemented.');
  }

  public update(_data: Partial<Schema>): DatabaseResult<ThisModel> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ThisModel): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }

  public hoge() { }
}

describe('モデルまわりの Type Utilities', () => {
  const TestModel = $TestModel.with({} as PrismaClient);
  const builder: ModelBuilderType = { type: 'ANONYMOUS' };
  const rawData = {} as RawData;
  const { default: mDefault, withResolved: mWithResolved } = TestModel.__build.__with(rawData, builder)._unsafeUnwrap();

  it('`__build``DEFAULT` や `WITH_RESOLVED` が推論されるか.', () => {
    expectTypeOf(mDefault.dataResolved).toEqualTypeOf<undefined>();
    expectTypeOf(mWithResolved.dataResolved).toEqualTypeOf<SchemaResolved>();
  });
  it('モデルのモードを取得できる', () => {
    expectTypeOf<ModelModeOf<typeof mDefault>>().toEqualTypeOf<'DEFAULT'>();
    // FIXME: これが通るようにしたい.  ThisModel<'WITH_RESOLVED'> は AnyModel<'DEFAULT'> 制約を満たさないよう.  たぶん AnyModel にモードが伝わっていないのかも.
    // expectTypeOf<ModelModeOf<typeof mWithResolved>>().toEqualTypeOf<'WITH_RESOLVED'>();
  });
  it('モデル内の型を取得できる', () => {
    expectTypeOf<ThisModel['data']>().toEqualTypeOf<Schema>();
    expectTypeOf<ThisModel['dataResolved']>().toEqualTypeOf<undefined>();

    type Expected = DatabaseResult<{
      build: (builder: ModelBuilderType) => BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
      buildBy: (memberAsBuilder: $Member) => BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
      buildBySelf: () => BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
    }>;
    expectTypeOf<ReturnType<ThisModel['resolveRelation']>>().toEqualTypeOf<Expected>();

    expectTypeOf<ThisModel<'WITH_RESOLVED'>['data']>().toEqualTypeOf<Schema>();
    expectTypeOf<ThisModel<'WITH_RESOLVED'>['dataResolved']>().toEqualTypeOf<SchemaResolved>();
    expectTypeOf<ReturnType<ThisModel<'WITH_RESOLVED'>['resolveRelation']>>().toEqualTypeOf<never>();
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
