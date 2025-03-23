import type { $Member } from '@/models/member';
import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { Nullable, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberBase as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { type MemberDetail, toMemberDetail } from '@/utils/member';
import { buildRawData, includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

/// Metadata ///

const metadata = {
  displayName: '部員の基本情報',
  modelName: 'memberBase',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberBase'>;

/// Custom Types ///

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    iconUrl: URL;
  }
>;

type IncludeKey = keyof Prisma.MemberBaseInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];
const includeKeysRelated = ['MemberStatus', 'MemberSensitive', 'MemberActive', 'MemberActiveInternal', 'MemberActiveExternal', 'MemberAlumni'] as const;

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  MemberStatus: ModelSchemaRawOf<$MemberStatus>;
  MemberSensitive: ModelSchemaRawOf<$MemberSensitive>;
  MemberActive: Nullable<ModelSchemaRawOf<$MemberActive>>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
  MemberAlumni: Nullable<ModelSchemaRawOf<$MemberAlumni>>;
}

interface SchemaResolved {
  _parent: {
    Member: () => BuildModelResult<$Member>;
  };
  member: {
    Status: () => BuildModelResult<$MemberStatus>;
    Sensitive: () => BuildModelResult<$MemberSensitive>;
    detail: MemberDetail;
  };
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $MemberBase<M>;
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
    iconUrl: new URL(__raw.iconUrl),
  }),
  schemaResolved: (__rawResolved) => {
    const { models } = new Database(client);
    const { Member, MemberStatus, MemberSensitive, ...detail } = __rawResolved;

    return {
      _parent: {
        Member: () => buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(Member)).build(builder),
      },
      member: {
        Status: () => buildRawData(models.member.Status.__build).default(schemaRaw2rawData<$MemberStatus>(MemberStatus)).build(builder),
        Sensitive: () => buildRawData(models.member.Sensitive.__build).default(schemaRaw2rawData<$MemberSensitive>(MemberSensitive)).build(builder),
        detail: toMemberDetail(client, builder, detail),
      },
    };
  },
})) satisfies ModelNormalizer<ThisModel>;

/// Model ///

export class $MemberBase<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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
      default: new $MemberBase(client, rawData, builder),
      withResolved: new $MemberBase<'WITH_RESOLVED'>(client, rawData, builder),
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
          client.memberBase.findUniqueOrThrow({
            where: { memberId },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('from'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).default);

        return rawData.map(buildRawData(__build).default);
      },
      fromWithResolved: (memberId: MemberId) => {
        const rFetchedData = ResultAsync.combine([
          Database.transformResult(
            client.memberBase.findUniqueOrThrow({
              where: { memberId },
            }),
          ),
          Database.transformResult(
            client.member.findUniqueOrThrow({
              where: { id: memberId },
              include: includeKeys2select(includeKeysRelated),
            }),
          ),
        ])
          .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'));

        return rFetchedData.map((
          [memberBase, { MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, ...Member }],
        ) => {
          if (MemberStatus == null) {
            throw new Error('不正なデータ: `MemberStatus` が取得できませんでした');
          }

          if (MemberSensitive == null) {
            throw new Error('不正なデータ: `MemberSensitive` が取得できませんでした');
          }

          return buildRawData(__build).withResolved({
            __raw: memberBase,
            __rawResolved: { Member, MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni },
          });
        });
      },
      fetchMany: (args) => {
        const rawDataList = Database.transformResult(
          client.memberBase.findMany(args),
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
        const rFetchedData = ResultAsync.combine([
          Database.transformResult(
            client.memberBase.findMany({
              ...args,
              orderBy: { memberId: 'asc' },
            }),
          ),
          Database.transformResult(
            client.member.findMany({
              orderBy: { id: 'asc' },
              include: includeKeys2select(includeKeysRelated),
            }),
          ),
        ])
          .mapErr(Database.dbErrorWith(metadata).transform('fetchManyWithResolved'));

        const rawDataList = rFetchedData.map(([memberBase, members]) => {
          const membersMap = new Map<string, SchemaResolvedRaw>();

          members.forEach((m) => {
            const { MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, ...Member } = m;
            if (MemberStatus == null) {
              throw new Error('不正なデータ: `MemberStatus` が取得できませんでした');
            }
            if (MemberSensitive == null) {
              throw new Error('不正なデータ: `MemberSensitive` が取得できませんでした');
            }
            membersMap.set(m.id, { Member, MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni });
          });

          return memberBase.map((r) => {
            const resolved = membersMap.get(r.memberId);
            if (resolved == null) throw new Error('不正なデータ: `Member` が取得できませんでした');
            return { __raw: r, __rawResolved: resolved };
          });
        });

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
      () => $MemberBase.with(this.client).fromWithResolved(this.data.memberId),
    );
  }

  public update(_data: Partial<Schema>): DatabaseResult<ThisModel> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ThisModel): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }

  public hoge() { }
}
