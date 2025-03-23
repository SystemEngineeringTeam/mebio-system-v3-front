import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberActiveExternal as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { buildRawData, fillPrismaSkip, includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok } from 'neverthrow';
import { match } from 'ts-pattern';

/// Metadata ///

const metadata = {
  displayName: '現役生 (外部) の情報',
  modelName: 'memberActiveExternal',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberActiveExternal'>;

/// Custom Types ///

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
  }
>;

type IncludeKey = keyof Prisma.MemberActiveExternalInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => BuildModelResult<$Member>;
  };
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $MemberActiveExternal<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
type RawData = ModelRawData4build<ThisModel>;

/// Normalizer ///

const normalizer = ((client, builder) => ({
  schema: (__raw) => ({
    ...__raw,
    memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
  }),
  schemaResolved: (__rawResolved) => {
    const { models } = new Database(client);
    const { Member } = __rawResolved;

    return {
      _parent: {
        Member: () => buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(Member)).build(builder),
      },
    };
  },
})) satisfies ModelNormalizer<ThisModel>;

/// Model ///

export class $MemberActiveExternal<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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
      default: new $MemberActiveExternal(client, rawData, builder),
      withResolved: new $MemberActiveExternal<'WITH_RESOLVED'>(client, rawData, builder),
    })) satisfies ModelUnwrappedInstances__DO_NOT_EXPOSE<ThisModel>;

    const toInstances = ((rawData, builder) => match(builder)
      .with({ type: 'ANONYMOUS' }, () => err({ type: 'PERMISSION_DENIED', detail: { builder } } as const))
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
      from: (memberId: MemberId) => {
        const rawData = Database.transformResult(
          client.memberActiveExternal.findUniqueOrThrow({
            where: { memberId },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('from'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).default);

        return rawData.map(buildRawData(__build).default);
      },
      fromWithResolved: (memberId: MemberId) => {
        const rawData = Database.transformResult(
          client.memberActiveExternal.findUniqueOrThrow({
            where: { memberId },
            include: includeKeys2select(includeKeys),
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).withResolved);

        return rawData.map(buildRawData(__build).withResolved);
      },
      fetchMany: (args) => {
        const rawDataList = Database.transformResult(
          client.memberActiveExternal.findMany(args),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('fetchMany'))
          .map((r) => r.map(separateRawData<ThisModel, IncludeKey>(includeKeys).default));

        return rawDataList.map((ms) => ({
          build: (builder) => ms.map((r) => buildRawData(__build).default(r).build(builder)),
          buildBy: (memberAsBuilder) => ms.map((r) => buildRawData(__build).default(r).buildBy(memberAsBuilder)),
          buildBySelf: () => ms.map((r) => buildRawData(__build).default(r).buildBySelf()),
        }));
      },
      fetchManyWithResolved: (args) => {
        const rawDataList = Database.transformResult(
          client.memberActiveExternal.findMany({
            ...args,
            include: includeKeys2select(includeKeys),
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('fetchManyWithResolved'))
          .map((r) => r.map(separateRawData<ThisModel, IncludeKey>(includeKeys).withResolved));

        return rawDataList.map((ms) => ({
          build: (builder) => ms.map((r) => buildRawData(__build).withResolved(r).build(builder)),
          buildBy: (memberAsBuilder) => ms.map((r) => buildRawData(__build).withResolved(r).buildBy(memberAsBuilder)),
          buildBySelf: () => ms.map((r) => buildRawData(__build).withResolved(r).buildBySelf()),
        }));
      },
    } satisfies ModelBuilder<ThisModel>;
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $MemberActiveExternal.with(this.client).fromWithResolved(this.data.memberId),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    return Database.transformResult(
      this.client.memberActiveExternal.update({ data: fillPrismaSkip(data), where: { memberId: this.data.memberId } }),
    )
      .mapErr(this.dbError.transform('update'))
      .map((r) => buildRawData($MemberActiveExternal.with(this.client).__build).default(schemaRaw2rawData<$MemberActiveExternal>(r)))
      .map((r) => r.build(this.builder)._unsafeUnwrap());
  }

  public delete(): DatabaseResult<void> {
    return Database.transformResult(
      this.client.memberActiveExternal.delete({ where: { memberId: this.data.memberId } }),
    )
      .mapErr(this.dbError.transform('delete'))
      .map(() => undefined);
  }

  public hoge() { }
}
