import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Brand, Nullable, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  Payment as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';
import { includeKeys2select, isSelf, matchWithDefault, matchWithResolved } from '@/utils/model';
import { err, ok } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: '支払い',
  modelName: 'payment',
  primaryKeyName: 'id',
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
  Payer: ModelSchemaRawOf<$Member>;
  Receiver: ModelSchemaRawOf<$Member>;
  Approver: Nullable<ModelSchemaRawOf<$Member>>;
}

interface SchemaResolved {
  member: {
    Payer: () => BuildModelResult<ModelEntityOf<$Member>>;
    Receiver: () => BuildModelResult<ModelEntityOf<$Member>>;
    Approver: () => Nullable<BuildModelResult<ModelEntityOf<$Member>>>;
  };
}

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, ModelGen>;
type RawData = ModelRawData4build<ThisModel>;

/// Model ///

export const __Payment = (<Mode extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Payment implements ThisModel<Mode> {
  public static __prisma = client;

  private dbError = Database.dbErrorWith(metadata);

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  private constructor({ __raw, __rawResolved }: RawData, private builder?: ModelEntityOf<$Member>) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      id: PaymentId.from(__raw.id)._unsafeUnwrap(),
      payerId: MemberId.from(__raw.payerId)._unsafeUnwrap(),
      receiverId: MemberId.from(__raw.receiverId)._unsafeUnwrap(),
      approverId: __raw.approverId != null ? MemberId.from(__raw.approverId)._unsafeUnwrap() : null,
    };

    const { models } = new Database(client);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        member: {
          Payer: () => models.Member.__build({ __raw: r.Payer }, builder),
          Receiver: () => models.Member.__build({ __raw: r.Receiver }, builder),
          Approver: () => r.Approver != null ? models.Member.__build({ __raw: r.Approver }) : null,
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static __build(rawData: { __raw: SchemaRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'DEFAULT'>>;
  public static __build(rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
  public static __build<M extends ModelMode>(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<M>> {
    const Model = __Payment<M>(client);
    if (isSelf(builder)) {
      return ok(new Model(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new Model(rawData, builder));
  }

  public static from(id: PaymentId) {
    return Database.transformResult(
      client.payment.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => ({
        buildBy: (builder: ModelEntityOf<$Member>) => Payment.__build({ __raw }, builder),
        buildBySelf: () => Payment.__build({ __raw }),
      }));
  }

  public static fromWithResolved(id: PaymentId) {
    const rawData = Database.transformResult(
      client.payment.findUniqueOrThrow({
        where: { id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map((
        { MemberAsApprover, MemberAsPayer, MemberAsReceiver, ...__raw },
      ) => ({
        __raw,
        __rawResolved: { Payer: MemberAsPayer, Receiver: MemberAsReceiver, Approver: MemberAsApprover },
      }));

    return rawData.map(({ __raw, __rawResolved }) => ({
      buildBy: (builder: ModelEntityOf<$Member>) => Payment.__build({ __raw, __rawResolved }, builder),
      buildBySelf: () => Payment.__build({ __raw, __rawResolved }),
    }));
  }

  public resolveRelation() {
    const rawData = matchWithDefault(
      this.__rawResolved,
      () => Database.transformResult(
        client.payment.findUniqueOrThrow({
          where: { id: this.data.id },
          include: includeKeys2select(includeKeys),
        }),
      )
        .mapErr(Database.dbErrorWith(metadata).transform('resolveRelation'))
        .map(
          (
            { MemberAsApprover, MemberAsPayer, MemberAsReceiver, ...__raw },
          ) => ({
            __raw,
            __rawResolved: { Payer: MemberAsPayer, Receiver: MemberAsReceiver, Approver: MemberAsApprover },
          }),
        ),
    );

    return rawData.map(({ __raw, __rawResolved }) => ({
      buildBy: (builder: ModelEntityOf<$Member>) => Payment.__build({ __raw, __rawResolved }, builder),
      buildBySelf: () => Payment.__build({ __raw, __rawResolved }),
    }));
  }

  public update(_data: Partial<Schema>): DatabaseResult<Payment> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGen;

export type $Payment<M extends ModelMode = 'DEFAULT'> = ModelGen & typeof __Payment<M>;

{
  const P = __Payment({} as PrismaClient);
  const p = (await P.fromWithResolved(''))._unsafeUnwrap();
  const pp = p.buildBySelf()._unsafeUnwrap();
  const ppp = pp.dataResolved;
}
