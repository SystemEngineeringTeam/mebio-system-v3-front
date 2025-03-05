import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { $Payment } from '@/models/payment';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
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

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $Member<M>;
type RawData = ModelRawData4build<ThisModel>;

/// Model ///

export class $Member<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
  private dbError = Database.dbErrorWith(metadata);
  private client;
  public declare __struct: ThisModelImpl<Mode>;

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  private constructor(
    public __prisma: PrismaClient,
    { __raw, __rawResolved }: RawData,
    private builder?: ThisModel,
  ) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      id: MemberId.from(__raw.id)._unsafeUnwrap(),
      subject: Subject.from(__raw.subject),
      securityRole: zSecurityRoles.parse(__raw.securityRole),
    };

    const { models } = new Database(__prisma);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _referenced: {
          paymentsAs: {
            Payer: () => r.PaymentAsPayer.map((__raw) => models.Payment.__build<'DEFAULT'>({ __raw }, builder)),
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
          detail: toMemberDetail(client, { MemberAlumni: r.MemberAlumni, MemberActive: r.MemberActive, MemberActiveExternal: r.MemberActiveExternal, MemberActiveInternal: r.MemberActiveInternal }, builder),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
    this.client = __prisma;
  }

  public static with(client: PrismaClient) {
    const internal = {
      __build: (rawData, builder) => {
        // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
        if (builder.data.securityRole !== 'OWNER') {
          return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
        }

        return ok({
          default: new $Member(client, rawData, builder),
          withResolved: new $Member<'WITH_RESOLVED'>(client, rawData, builder),
        });
      },
      __buildBySelf: (rawData) => ok({
        default: new $Member(client, rawData),
        withResolved: new $Member<'WITH_RESOLVED'>(client, rawData),
      }),
    } satisfies ModelBuilderInternal<ThisModel>;

    return {
      ...internal,
      from: (id: MemberId) => {
        const rawData = Database.transformResult(
          client.member.findUniqueOrThrow({
            where: { id },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('from'))
          .map((__raw) => ({ __raw }));

        return rawData.map(({ __raw }) => ({
          buildBy: (builder) => internal.__build({ __raw, __rawResolved: undefined }, builder).map((m) => m.default),
          buildBySelf: () => internal.__buildBySelf({ __raw, __rawResolved: undefined }).map((m) => m.default),
        }));
      },

      fromWithResolved: (id: MemberId) => {
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
          buildBy: (builder: ThisModel) => internal.__build({ __raw, __rawResolved }, builder).map((m) => m.withResolved),
          buildBySelf: () => internal.__buildBySelf({ __raw, __rawResolved }).map((m) => m.withResolved),
        }));
      },
    } satisfies ModelBuilder<ThisModel>;
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => {
        const rawData = Database.transformResult(
          this.client.member.findUniqueOrThrow({
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
          );

        const { __build, __buildBySelf } = $Member.with(this.client);
        return rawData.map(({ __raw, __rawResolved }) => ({
          buildBy: (builder: ThisModel) => __build({ __raw, __rawResolved }, builder).map((m) => m.withResolved),
          buildBySelf: () => __buildBySelf({ __raw, __rawResolved }).map((m) => m.withResolved),
        }));
      },
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

{
  const Member = $Member.with({} as PrismaClient);
  const member = (await Member.from(''))._unsafeUnwrap().buildBySelf()._unsafeUnwrap();
  const _m = (await member.resolveRelation())._unsafeUnwrap().buildBySelf()._unsafeUnwrap();
  const a = (await _m.resolveRelation())._unsafeUnwrap().buildBySelf()._unsafeUnwrap();
}
