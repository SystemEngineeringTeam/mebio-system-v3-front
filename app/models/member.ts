import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { $Payment } from '@/models/payment';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Brand, Nullable, Override } from '@/types/utils';
import type { MemberDetail } from '@/utils/member';
import type {
  Prisma,
  PrismaClient,
  Member as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid, toBrand } from '@/utils';
import { toMemberDetail } from '@/utils/member';
import { includeKeys2select, isSelf, matchWithDefault, matchWithResolved } from '@/utils/model';
import { err, ok } from 'neverthrow';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '部員',
  modelName: 'member',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'member'>;

/// Custom Types ///

export type MemberId = Brand<'memberId', string>;
export const MemberId = {
  from: parseUuid<'memberId'>,
};

export type Subject = Brand<'subject', string>;
export const Subject = {
  from: toBrand<'subject'>,
};

/**
 * セキュリティーロール – 下に行くほど権限が強いです.  `indexOf` で権限の強さを比較できます.
 */
export const SECURITY_ROLE = [
  'DEFAULT',
  'MEMBER',
  'READ',
  'PAYMENT_APPROVE',
  'OWNER',
] as const;
const zSecurityRoles = z.enum(SECURITY_ROLE);
type SecurityRole = ArrayElem<typeof SECURITY_ROLE>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    id: MemberId;
    subject: Subject;
    securityRole: SecurityRole;
  }
>;

type IncludeKey = keyof Prisma.MemberInclude;
const includeKeys = ['MemberBase', 'MemberSensitive', 'MemberActive', 'MemberActiveInternal', 'MemberActiveExternal', 'MemberAlumni', 'MemberStatus', 'MemberStatusAsUpdaterToHasDeleted', 'MemberStatusAsUpdaterToLastRenewalDate', 'PaymentAsPayer', 'PaymentAsReceiver', 'PaymentAsApprover'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  MemberBase: ModelSchemaRawOf<$MemberBase>;
  MemberStatus: ModelSchemaRawOf<$MemberStatus>;
  MemberSensitive: ModelSchemaRawOf<$MemberSensitive>;
  MemberActive: Nullable<ModelSchemaRawOf<$MemberActive>>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
  MemberAlumni: Nullable<ModelSchemaRawOf<$MemberAlumni>>;
  MemberStatusAsUpdaterToHasDeleted: Array<ModelSchemaRawOf<$MemberStatus>>;
  MemberStatusAsUpdaterToLastRenewalDate: Array<ModelSchemaRawOf<$MemberStatus>>;
  PaymentAsPayer: Array<ModelSchemaRawOf<$Payment>>;
  PaymentAsReceiver: Array<ModelSchemaRawOf<$Payment>>;
  PaymentAsApprover: Array<ModelSchemaRawOf<$Payment>>;
}

interface SchemaResolved {
  _referenced: {
    paymentsAs: {
      Payer: () => Array<BuildModelResult<ModelEntityOf<$Payment>>>;
      Receiver: () => Array<BuildModelResult<ModelEntityOf<$Payment>>>;
      Approver: () => Array<BuildModelResult<ModelEntityOf<$Payment>>>;
    };
    memberStatusAsUpdaterTo: {
      HasDeleted: () => Array<BuildModelResult<ModelEntityOf<$MemberStatus>>>;
      LastRenewalDate: () => Array<BuildModelResult<ModelEntityOf<$MemberStatus>>>;
    };
  };
  member: {
    Status: () => BuildModelResult<ModelEntityOf<$MemberStatus>>;
    Base: () => BuildModelResult<ModelEntityOf<$MemberBase>>;
    Sensitive: () => BuildModelResult<ModelEntityOf<$MemberSensitive>>;
    detail: MemberDetail;
  };
}

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, ModelGen>;
type RawData = ModelRawData4build<ThisModel>;

/// Model ///

export const __Member = (<Mode extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Member implements ThisModel<Mode> {
  public static __prisma = client;

  private dbError = Database.dbErrorWith(metadata);

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  private constructor({ __raw, __rawResolved }: RawData, private builder?: ThisModel) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      id: MemberId.from(__raw.id)._unsafeUnwrap(),
      subject: Subject.from(__raw.subject),
      securityRole: zSecurityRoles.parse(__raw.securityRole),
    };

    const { models } = new Database(client);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _referenced: {
          paymentsAs: {
            // `map` のコールバックを Tear-off しようとしたそこのキミ！  このコンストラクターはオーバーロードされていて複数受け入れるから無理なんだな.
            Payer: () => r.PaymentAsPayer.map((__raw) => models.Payment.__build({ __raw }, builder)),
            Receiver: () => r.PaymentAsReceiver.map((__raw) => models.Payment.__build({ __raw }, builder)),
            Approver: () => r.PaymentAsApprover.map((__raw) => models.Payment.__build({ __raw }, builder)),
          },
          memberStatusAsUpdaterTo: {
            HasDeleted: () => r.MemberStatusAsUpdaterToHasDeleted.map((__raw) => models.member.Status.__build({ __raw }, builder)),
            LastRenewalDate: () => r.MemberStatusAsUpdaterToLastRenewalDate.map((__raw) => models.member.Status.__build({ __raw }, builder)),
          },
        },
        member: {
          Base: () => models.member.Base.__build({ __raw: r.MemberBase }, builder),
          Status: () => models.member.Status.__build({ __raw: r.MemberStatus }, builder),
          Sensitive: () => models.member.Sensitive.__build({ __raw: r.MemberSensitive }, builder),
          detail: toMemberDetail(client, { MemberAlumni: r.MemberAlumni, MemberActive: r.MemberActive, MemberActiveExternal: r.MemberActiveExternal, MemberActiveInternal: r.MemberActiveInternal }),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static __build(rawData: { __raw: SchemaRaw }, builder?: ThisModel): BuildModelResult<ThisModel<'DEFAULT'>>;
  public static __build(rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw }, builder?: ThisModel): BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
  public static __build<M extends ModelMode>(rawData: RawData, builder?: ThisModel): BuildModelResult<ThisModel<M>> {
    const Model = __Member<M>(client);
    if (isSelf(builder)) {
      return ok(new Model(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new Model(rawData, builder));
  }

  public static from(id: MemberId) {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => ({
        buildBy: (builder: ThisModel) => Member.__build({ __raw }, builder),
        buildBySelf: () => Member.__build({ __raw }),
      }));
  }

  public static fromWithResolved(id: MemberId) {
    const rawData = Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(
        (
          { MemberStatus, MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover, ...__raw },
        ) => ({
          __raw,
          __rawResolved: { MemberStatus: MemberStatus!, MemberBase: MemberBase!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover },
        }),
      );

    return rawData.map(({ __raw, __rawResolved }) => ({
      // buildBy: (builder: ThisModel) => Member.__build({ __raw, __rawResolved }, builder),
      // buildBySelf: () => Member.__build({ __raw, __rawResolved }),
    }));
  }

  public resolveRelation() {
    const rawData = matchWithDefault(
      this.__rawResolved,
      () => Database.transformResult(
        client.member.findUniqueOrThrow({
          where: { id: this.data.id },
          include: includeKeys2select(includeKeys),
        }),
      )
        .mapErr(this.dbError.transform('resolveRelation'))
        .map(
          (
            { MemberStatus, MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover, ...__raw },
          ) => ({
            __raw,
            __rawResolved: { MemberStatus: MemberStatus!, MemberBase: MemberBase!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover },
          }),
        ),
    );

    return rawData.map(({ __raw, __rawResolved }) => ({
      buildBy: (builder: ThisModel) => Member.__build({ __raw, __rawResolved }, builder),
      buildBySelf: () => Member.__build({ __raw, __rawResolved }),
    }));
  }

  public update(_data: Partial<Schema>): DatabaseResult<ThisModel> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ThisModel): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGen;

export type $Member<M extends ModelMode = 'DEFAULT'> = ModelGen & typeof __Member<M>;
