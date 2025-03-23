import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { Brand, Nullable, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  Payment as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';
import { buildRawData, includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok } from 'neverthrow';
import { match } from 'ts-pattern';

/// Metadata ///

const metadata = {
  displayName: '支払い',
  modelName: 'payment',
  primaryKeyName: 'payerId',
} as const satisfies ModelMetadata<'payment'>;

/// Custom Types ///

type PaymentId = Brand<'payment', string>;
const PaymentId = {
  from: parseUuid<'payment'>,
};

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    id: PaymentId;
    payerId: MemberId;
    receiverId: MemberId;
    approverId: Nullable<MemberId>;
  }
>;

type IncludeKey = keyof Prisma.PaymentInclude;
const includeKeys = ['MemberAsPayer', 'MemberAsReceiver', 'MemberAsApprover'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  MemberAsPayer: ModelSchemaRawOf<$Member>;
  MemberAsReceiver: ModelSchemaRawOf<$Member>;
  MemberAsApprover: Nullable<ModelSchemaRawOf<$Member>>;
}

interface SchemaResolved {
  member: {
    Payer: () => BuildModelResult<$Member>;
    Receiver: () => BuildModelResult<$Member>;
    Approver: () => Nullable<BuildModelResult<$Member>>;
  };
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $Payment<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
type RawData = ModelRawData4build<ThisModel>;

/// Normalizer ///

const normalizer = ((client, builder) => ({
  schema: (__raw) => ({
    ...__raw,
    id: PaymentId.from(__raw.id)._unsafeUnwrap(),
    payerId: MemberId.from(__raw.payerId)._unsafeUnwrap(),
    receiverId: MemberId.from(__raw.receiverId)._unsafeUnwrap(),
    approverId: __raw.approverId != null ? MemberId.from(__raw.approverId)._unsafeUnwrap() : null,
  }),
  schemaResolved: (__rawResolved) => {
    const { models } = new Database(client);
    const { MemberAsPayer, MemberAsReceiver, MemberAsApprover } = __rawResolved;

    return {
      member: {
        Payer: () => buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(MemberAsPayer)).build(builder),
        Receiver: () => buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(MemberAsReceiver)).build(builder),
        Approver: () => MemberAsApprover != null
          ? buildRawData(models.Member.__build).default(schemaRaw2rawData<$Member>(MemberAsApprover)).build(builder)
          : null,
      },
    };
  },
})) satisfies ModelNormalizer<ThisModel>;

/// Model ///

export class $Payment<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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
      default: new $Payment(client, rawData, builder),
      withResolved: new $Payment<'WITH_RESOLVED'>(client, rawData, builder),
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
      from: (id: PaymentId) => {
        const rawData = Database.transformResult(
          client.payment.findUniqueOrThrow({
            where: { id },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('from'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).default);

        return rawData.map(buildRawData(__build).default);
      },
      fromWithResolved: (id: PaymentId) => {
        const rawData = Database.transformResult(
          client.payment.findUniqueOrThrow({
            where: { id },
            include: includeKeys2select(includeKeys),
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).withResolved);

        return rawData.map(buildRawData(__build).withResolved);
      },
      fetchMany: (args) => {
        const rawDataList = Database.transformResult(
          client.payment.findMany(args),
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
          client.payment.findMany({
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
      () => $Payment.with(this.client).fromWithResolved(this.data.id),
    );
  }

  public update(_data: Partial<Schema>): DatabaseResult<ThisModel> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }

  public hoge() { }
}
