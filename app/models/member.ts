import type { $Payment } from '@/models/payment';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Brand, Nullable, Override } from '@/types/utils';
import type { MemberDetail } from '@/utils/member';
import type {
  Prisma,
  PrismaClient,
  Member as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid, toBrand } from '@/utils';
import { buildRawData, includeKeys2select, matchWithDefault, matchWithResolved, separateRawData } from '@/utils/model';
import { err, ok } from 'neverthrow';
import { match } from 'ts-pattern';
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

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $Member<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
type RawData = ModelRawData4build<ThisModel>;

/// Normalizer ///

const normalizer = ((client, builder) => ({
  schema: (__raw) => ({
    ...__raw,
    id: MemberId.from(__raw.id)._unsafeUnwrap(),
    subject: Subject.from(__raw.subject),
    securityRole: zSecurityRoles.parse(__raw.securityRole),
  }),
  schemaResolved: (__rawResolved) => ({
    _referenced: {
      paymentsAs: {
        Payer: () => __rawResolved.PaymentAsPayer.map((__raw) => $Payment.__build<'DEFAULT'>({ __raw })),
        Receiver: () => __rawResolved.PaymentAsReceiver.map((__raw) => $Payment.__build({ __raw })),
        Approver: () => __rawResolved.PaymentAsApprover.map((__raw) => $Payment.__build({ __raw })),
      },
      memberStatusAsUpdaterTo: {
        HasDeleted: () => __rawResolved.MemberStatusAsUpdaterToHasDeleted.map((__raw) => $MemberStatus.__build({ __raw })),
        LastRenewalDate: () => __rawResolved.MemberStatusAsUpdaterToLastRenewalDate.map((__raw) => $MemberStatus.__build({ __raw })),
      },
    },
    member: {
      Base: () => $MemberBase.__build({ __raw: __rawResolved.MemberBase }),
      Status: () => $MemberStatus.__build({ __raw: __rawResolved.MemberStatus }),
      Sensitive: () => $MemberSensitive.__build({ __raw: __rawResolved.MemberSensitive }),
      detail: toMemberDetail(client, { MemberAlumni: __rawResolved.MemberAlumni, MemberActive: __rawResolved.MemberActive, MemberActiveExternal: __rawResolved.MemberActiveExternal, MemberActiveInternal: __rawResolved.MemberActiveInternal }),
    },
  }),
})) satisfies ModelNormalizer<ThisModel>;

/// Model ///

export class $Member<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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

  public static with(client: PrismaClient): ModelBuilder<ThisModel> {
    const __toUnwrappedInstances = ((rawData, builder) => ({
      default: new $Member(client, rawData, builder),
      withResolved: new $Member<'WITH_RESOLVED'>(client, rawData, builder),
    })) satisfies ModelUnwrappedInstances__DO_NOT_EXPOSE<ThisModel>;

    const toInstances = ((rawData, builder) => match(builder)
      .with({ type: 'ANONYMOUS' }, () => err({ type: 'PERMISSION_DENIED', detail: { builder: {} } } as const))
      .with({ type: 'SELF' }, () => ok(__toUnwrappedInstances(rawData, builder)))
      .with({ type: 'MEMBER' }, ({ member }) => {
        // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
        if (member.data.securityRole !== 'OWNER') {
          return err({ type: 'PERMISSION_DENIED', detail: { builder: {} } } as const);
        }
        return ok(__toUnwrappedInstances(rawData, builder));
      })
      .exhaustive()
    ) satisfies ModelInstances<ThisModel>;

    const __build = {
      __with: toInstances,
      by: (rawData, memberAsBuilder) => toInstances(rawData, { type: 'MEMBER', member: memberAsBuilder }),
      bySelf: (rawData) => toInstances(rawData, { type: 'SELF' }),
    } satisfies ModelBuilderInternal<ThisModel>;

    return {
      __build,
      from: (id: MemberId) => {
        const rawData = Database.transformResult(
          client.member.findUniqueOrThrow({
            where: { id },
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('from'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).default);

        return rawData.map(buildRawData(__build).default);
      },
      fromWithResolved: (id: MemberId) => {
        const rawData = Database.transformResult(
          client.member.findUniqueOrThrow({
            where: { id },
            include: includeKeys2select(includeKeys),
          }),
        )
          .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
          .map(separateRawData<ThisModel, IncludeKey>(includeKeys).withResolved);

        return rawData.map(buildRawData(__build).withResolved);
      },
    };
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $Member.with(this.client).fromWithResolved(this.data.id),
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
