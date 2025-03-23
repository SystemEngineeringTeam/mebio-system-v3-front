import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberSensitive as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { buildRawData, fillPrismaSkip, includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok } from 'neverthrow';
import { match } from 'ts-pattern';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '部員の非公開情報',
  modelName: 'memberSensitive',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberSensitive'>;

/// Custom Types ///

export const GENDER = ['male', 'female', 'other'] as const;
const zGender = z.enum(GENDER);
type Gender = ArrayElem<typeof GENDER>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    birthday: Date;
    gender: Gender;
  }
>;

type IncludeKey = keyof Prisma.MemberSensitiveInclude;
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
type ThisModel<M extends ModelMode = 'DEFAULT'> = $MemberSensitive<M>;
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
    birthday: new Date(__raw.birthday),
    gender: zGender.parse(__raw.gender),
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

export class $MemberSensitive<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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
      default: new $MemberSensitive(client, rawData, builder),
      withResolved: new $MemberSensitive<'WITH_RESOLVED'>(client, rawData, builder),
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
      from: (memberId: MemberId) => {
        const rawData = Database.transformResult(
          client.memberSensitive.findUniqueOrThrow({
            where: { memberId },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('from'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).default);

        return rawData.map(buildRawData(__build).default);
      },
      fromWithResolved: (memberId: MemberId) => {
        const rawData = Database.transformResult(
          client.memberSensitive.findUniqueOrThrow({
            where: { memberId },
            include: includeKeys2select(includeKeys),
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('fromWithResolved'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).withResolved);

        return rawData.map(buildRawData(__build).withResolved);
      },
      fetchMany: (args) => {
        const rawDataList = Database.transformResult(
          client.memberSensitive.findMany(args),
        )
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('fetchMany'))
          .map((r) => r.map(separateRawData<ThisModel, IncludeKey>(includeKeys).default));

        return rawDataList.map((ms) => ({
          build: (builder) => ms.map((r) => buildRawData(__build).default(r).build(builder)),
          buildBy: (memberAsBuilder) => ms.map((r) => buildRawData(__build).default(r).buildBy(memberAsBuilder)),
          buildBySelf: () => ms.map((r) => buildRawData(__build).default(r).buildBySelf()),
        }));
      },
      fetchManyWithResolved: (args) => {
        const rawDataList = Database.transformResult(
          client.memberSensitive.findMany({
            ...args,
            include: includeKeys2select(includeKeys),
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('fetchManyWithResolved'))
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
      () => $MemberSensitive.with(this.client).fromWithResolved(this.data.memberId),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    return Database.transformResult(
      this.client.memberSensitive.update({ data: fillPrismaSkip(data), where: { memberId: this.data.memberId } }),
    )
      .mapErr(this.dbError.transformPrismaBridge('update'))
      .map((r) => buildRawData($MemberSensitive.with(this.client).__build).default(schemaRaw2rawData<$MemberSensitive>(r)))
      .map((r) => r.build(this.builder)._unsafeUnwrap());
  }

  public delete(): DatabaseResult<void> {
    return Database.transformResult(
      this.client.memberSensitive.delete({ where: { memberId: this.data.memberId } }),
    )
      .mapErr(this.dbError.transformPrismaBridge('delete'))
      .map(() => undefined);
  }

  public hoge() { }
}
