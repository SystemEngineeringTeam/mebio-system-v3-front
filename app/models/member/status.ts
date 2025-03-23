import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberStatus as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { buildRawData, includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok } from 'neverthrow';
import { match } from 'ts-pattern';

/// Metadata ///

const metadata = {
  displayName: '部員のステータス',
  modelName: 'memberStatus',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberStatus'>;

/// Custom Types ///

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    updatedHasDeletedById: MemberId;
    updatedLastRenewalDateById: MemberId;
  }
>;

type IncludeKey = keyof Prisma.MemberStatusInclude;
const includeKeys = ['Member', 'UpdatedHasDeletedBy', 'UpdatedLastRenewalDateBy'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  UpdatedHasDeletedBy: ModelSchemaRawOf<$Member>;
  UpdatedLastRenewalDateBy: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => BuildModelResult<$Member>;
  };
  updaterTo: {
    hasDeleted: () => BuildModelResult<$Member>;
    lastRenewalDate: () => BuildModelResult<$Member>;
  };
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $MemberStatus<M>;
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
    updatedHasDeletedById: MemberId.from(__raw.updatedHasDeletedById)._unsafeUnwrap(),
    updatedLastRenewalDateById: MemberId.from(__raw.updatedLastRenewalDateById)._unsafeUnwrap(),
  }),
  schemaResolved: (__rawResolved) => {
    const { models } = new Database(client);
    const { Member, UpdatedHasDeletedBy, UpdatedLastRenewalDateBy } = __rawResolved;

    return {
      _parent: {
        Member: () => buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(Member)).build(builder),
      },
      updaterTo: {
        hasDeleted: () => buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(UpdatedHasDeletedBy)).build(builder),
        lastRenewalDate: () => buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(UpdatedLastRenewalDateBy)).build(builder),
      },
    };
  },
})) satisfies ModelNormalizer<ThisModel>;

/// Model ///

export class $MemberStatus<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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
      default: new $MemberStatus(client, rawData, builder),
      withResolved: new $MemberStatus<'WITH_RESOLVED'>(client, rawData, builder),
    })) satisfies ModelUnwrappedInstances__DO_NOT_EXPOSE<ThisModel>;

    const toInstances = ((rawData, builder) => match(builder)
      .with({ type: 'ANONYMOUS' }, () => err({ type: 'PERMISSION_DENIED', detail: { builder: {} } } as const))
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
          client.memberStatus.findUniqueOrThrow({
            where: { memberId },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('from'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).default);

        return rawData.map(buildRawData(__build).default);
      },
      fromWithResolved: (memberId: MemberId) => {
        const rawData = Database.transformResult(
          client.memberStatus.findUniqueOrThrow({
            where: { memberId },
            include: includeKeys2select(includeKeys),
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).withResolved);

        return rawData.map(buildRawData(__build).withResolved);
      },
    } satisfies ModelBuilder<ThisModel>;
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $MemberStatus.with(this.client).fromWithResolved(this.data.memberId),
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
