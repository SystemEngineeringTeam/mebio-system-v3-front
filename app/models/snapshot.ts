import type { DatabaseResult } from '@/types/database';
import type { Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { Brand, Override } from '@/types/utils';
import type {
  PrismaClient,
  Snapshot as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';
import { buildRawData, matchWithResolved, schemaRaw2rawData } from '@/utils/model';
import { err, ok } from 'neverthrow';
import { match } from 'ts-pattern';

/// Metadata ///

const metadata = {
  displayName: 'スナップショット',
  modelName: 'snapshot',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'snapshot'>;

/// Custom Types ///

export type SnapshotId = Brand<'snapshotId', string>;
export const SnapshotId = {
  from: parseUuid<'snapshotId'>,
};

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    id: SnapshotId;
    body: JSON;
  }
>;

interface SchemaResolvedRaw {
}

interface SchemaResolved {
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $Snapshot<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
type RawData = ModelRawData4build<ThisModel>;

/// Normalizer ///

const normalizer = ((_, __) => ({
  schema: (__raw) => ({
    ...__raw,
    id: SnapshotId.from(__raw.id)._unsafeUnwrap(),
    body: JSON.parse(__raw.body),
  }),
  schemaResolved: (__rawResolved) => ({}),
})) satisfies ModelNormalizer<ThisModel>;

/// Model ///

export class $Snapshot<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
  private dbError = Database.dbErrorWith(metadata);
  private client;
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
    this.client = __prisma;
  }

  public static with(client: PrismaClient) {
    const __toUnwrappedInstances = ((rawData, builder) => ({
      default: new $Snapshot(client, rawData, builder),
      withResolved: new $Snapshot<'WITH_RESOLVED'>(client, rawData, builder),
    })) satisfies ModelUnwrappedInstances__DO_NOT_EXPOSE<ThisModel>;

    const buildErr = Database.dbErrorWith(metadata).transformBuildModel('toInstances');
    const toInstances = ((rawData, builder) => match(builder)
      .with({ type: 'ANONYMOUS' }, () => err(buildErr({ type: 'PERMISSION_DENIED', detail: { builder } } as const)))
      .with({ type: 'SELF' }, () => ok(__toUnwrappedInstances(rawData, builder)))
      .with({ type: 'MEMBER' }, () => ok(__toUnwrappedInstances(rawData, builder)))
      .exhaustive()
    ) satisfies ModelInstances<ThisModel>;

    const __build = {
      __with: toInstances,
      by: (rawData, memberAsBuilder) => toInstances(rawData, { type: 'MEMBER', member: memberAsBuilder }),
      bySelf: (rawData) => toInstances(rawData, { type: 'SELF' }),
    } satisfies ModelBuilderInternal<ThisModel>;

    return {
      __build,
      from: (id: SnapshotId) => {
        const rawData = Database.transformResult(
          client.snapshot.findUniqueOrThrow({
            where: { id },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('from'))
          .map((data) => ({ __raw: data, __rawResolved: undefined }));

        return rawData.map(buildRawData(__build).default);
      },
      fetchMany: (args) => {
        const rawDataList = Database.transformResult(
          client.snapshot.findMany(args),
        )
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('fetchMany'))
          .map((r) => r.map((data) => ({ __raw: data, __rawResolved: undefined })));

        return rawDataList.map((ms) => ({
          build: (builder) => ms.map((r) => buildRawData(__build).default(r).build(builder)),
          buildBy: (memberAsBuilder) => ms.map((r) => buildRawData(__build).default(r).buildBy(memberAsBuilder)),
          buildBySelf: () => ms.map((r) => buildRawData(__build).default(r).buildBySelf()),
        }));
      },
    } satisfies ModelBuilder<ThisModel>;
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    return Database.transformResult(
      this.client.snapshot.update({
        data: {
          ...data,
          body: JSON.stringify(data.body),
        },
        where: { id: this.data.id },
      }),
    )
      .mapErr(this.dbError.transformPrismaBridge('update'))
      .map((r) => buildRawData($Snapshot.with(this.client).__build).default(schemaRaw2rawData<$Snapshot>(r)))
      .map((r) => r.build(this.builder)._unsafeUnwrap());
  }

  public delete(): DatabaseResult<void> {
    return Database.transformResult(
      this.client.snapshot.delete({ where: { id: this.data.id } }),
    )
      .mapErr(this.dbError.transformPrismaBridge('delete'))
      .map(() => undefined);
  }

  public hoge() { }
}
