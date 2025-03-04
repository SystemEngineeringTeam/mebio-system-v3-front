import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { $Payment } from '@/models/payment';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
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
import { includeKeys2select, matchWithDefault, matchWithResolved } from '@/utils/model';
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

type RawData = ModelRawData4build<SchemaRaw, SchemaResolvedRaw>;

/// Model ///

export const __Member = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Member<Mode extends ModelMode = M> {
  public static __prisma = client;

  private dbError = Database.dbErrorWith(metadata);

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  private constructor({ __raw, __rawResolved }: RawData, private builder?: Member) {
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

  public static __build<M extends ModelMode = 'DEFAULT'>(rawData: RawData, builder?: Member): BuildModelResult<Member<M>> {
    const isSelf = builder == null;
    if (isSelf) {
      return ok(new Member(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new Member(rawData, builder));
  }

  public static from(id: MemberId, builder: Member): DatabaseResult<BuildModelResult<Member<'DEFAULT'>>> {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => Member.__build({ __raw }, builder));
  }

  public static fromAsSelf(subject: Subject): DatabaseResult<BuildModelResult<Member<'DEFAULT'>>> {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { subject },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromAsSelf'))
      .map((__raw) => Member.__build({ __raw }));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<Member<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(
        (
          { MemberStatus, MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover, ...__raw },
        ) => new Member(
          {
            __raw,
            __rawResolved: { MemberStatus: MemberStatus!, MemberBase: MemberBase!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover },
          },
        ),
      );
  }

  public resolveRelation(): ModeWithDefault<Mode, DatabaseResult<Member<'WITH_RESOLVED'>>> {
    return matchWithDefault(
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
            { MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatus, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover, ...__raw },
          ) => new Member(
            {
              __raw,
              __rawResolved: { MemberBase: MemberBase!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatus: MemberStatus!, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover },
            },
          ),
        ),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<Member> {
    return Database.transformResult(
      client.member.update({ data, where: { id: this.data.id } }),
    )
      .mapErr(this.dbError.transform('update'))
      .map((__raw) => new Member({ __raw }, this.builder));
  }

  public delete(_operator: Member): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $Member<M extends ModelMode = 'DEFAULT'> = ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> & typeof __Member<M>;
