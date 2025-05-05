import type { $Member } from '@/models/member';
import type { Model, ModelBuilder, ModelBuilderType, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelSerializer, ModeWithResolved } from '@/types/model';
import type { Brand, Nullable, Override } from '@/types/utils';
import type { DatabaseResult } from '@/utils/errors/database';
import type {
  Prisma,
  PrismaClient,
  Payment as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';
import { DatabaseError, databaseWrapBridgeResult } from '@/utils/errors/database';
import { ModelOperationError } from '@/utils/errors/database/model-operation';
import { fillPrismaSkip, includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok, safeTry } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: '支払い',
  modelName: 'payment',
  primaryKeyName: 'payerId',
} as const satisfies ModelMetadata<'payment'>;

/// Custom Types ///

export type PaymentId = Brand<'payment', string>;
export const PaymentId = {
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
    Payer: () => $Member;
    Receiver: () => $Member;
    Approver: () => Nullable<$Member>;
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

/// Serializer ///

const serializer = ((client, builder) => ({
  schema: {
    fromRaw: (__raw) => ({
      ...__raw,
      id: PaymentId.from(__raw.id)._unsafeUnwrap(),
      payerId: MemberId.from(__raw.payerId)._unsafeUnwrap(),
      receiverId: MemberId.from(__raw.receiverId)._unsafeUnwrap(),
      approverId: __raw.approverId != null ? MemberId.from(__raw.approverId)._unsafeUnwrap() : null,
    }),
    toRaw: (data) => ({
      ...data,
      approverId: data.approverId ?? null,
    }),
  },
  schemaResolved: {
    fromRaw: (__raw) => {
      const { models } = new Database(client);
      const { MemberAsPayer, MemberAsReceiver, MemberAsApprover } = __raw;

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
    toRaw: (data) => {
      const { member } = data;
      return {
        MemberAsPayer: member.Payer().data.__raw,
        MemberAsReceiver: member.Receiver().data.__raw,
        MemberAsApprover: member.Approver() != null ? member.Approver().data.__raw : null,
      };
    },
  },
})) satisfies ModelSerializer<ThisModel>;

/// Utils ///

const separateRD = separateRawData<ThisModel, IncludeKey>(includeKeys);
const dbError = DatabaseError.createWith(metadata);

/// Model ///

export class $Payment<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
  public declare __struct: ThisModelImpl<Mode>;
  public declare __variants: ThisModelVariants;

  public __prisma: PrismaClient;

  private serialized: ReturnType<typeof serializer>;

  private constructor(
    private client: PrismaClient,
    private rawData: RawData,
    private builder: ModelBuilderType,
  ) {
    this.__prisma = client;
    this.serialized = serializer(client, this.builder);
  }

  public get __raw(): SchemaRaw {
    return this.rawData.__raw;
  }

  public get data(): Schema {
    return this.serialized.schema.fromRaw(this.rawData.__raw);
  }

  public get __rawResolved(): ModeWithResolved<Mode, SchemaResolvedRaw> {
    return matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(this.rawData.__rawResolved, this.serialized.schemaResolved.fromRaw).rawResolved;
  }

  public get dataResolved(): ModeWithResolved<Mode, SchemaResolved> {
    return matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(this.rawData.__rawResolved, this.serialized.schemaResolved.fromRaw).dataResolved;
  }

  public static with(client: PrismaClient) {
    return (builder: ModelBuilderType) => ({
      from: (id: PaymentId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.payment.findUniqueOrThrow({ where: { id } }),
        ).map(separateRD.default);

        return ok(new $Payment(client, rawData, builder));
      }).mapErr(dbError('from')),

      fromWithResolved: (id: PaymentId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.payment.findUniqueOrThrow({ where: { id }, include: includeKeys2select(includeKeys) }),
        ).map(separateRD.withResolved);

        return ok(new $Payment<'WITH_RESOLVED'>(client, rawData, builder));
      }).mapErr(dbError('fromWithResolved')),

      fetchMany: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.payment.findMany(args),
        ).map((ms) => ms.map(separateRD.default));

        return ok(rawData.map((data) => new $Payment(client, data, builder)));
      }).mapErr(dbError('fetchMany')),
    } as const satisfies ModelBuilder<ThisModel>);
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $Payment.with(this.client)(this.builder).fromWithResolved(this.data.id),
    );
  }

  public update(data: Partial<Schema>) {
    return databaseWrapBridgeResult(
      this.client.payment.update({ data: fillPrismaSkip(data), where: { id: this.data.id } }),
    )
      .mapErr(dbError('update'))
      .map(separateRD.default)
      .map((r) => new $Payment(this.client, r, this.builder));
  }

  public delete(): DatabaseResult<void> {
    return databaseWrapBridgeResult(
      this.client.payment.delete({ where: { id: this.data.id } }),
    )
      .mapErr(dbError('delete'))
      .map(() => undefined);
  }
}
