import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { $Payment } from '@/models/payment';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelBuilder, ModelBuilderInternal, ModelBuilderType, ModelGenerator, ModelInstances, ModelMetadata, ModelMode, ModelNormalizer, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelUnwrappedInstances__DO_NOT_EXPOSE, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Brand, Nullable, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  Member as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid, toBrand } from '@/utils';
import { type MemberDetail, toMemberDetail } from '@/utils/member';
import { buildRawData, includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
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
      Payer: () => Array<BuildModelResult<$Payment>>;
      Receiver: () => Array<BuildModelResult<$Payment>>;
      Approver: () => Array<BuildModelResult<$Payment>>;
    };
    memberStatusAsUpdaterTo: {
      HasDeleted: () => Array<BuildModelResult<$MemberStatus>>;
      LastRenewalDate: () => Array<BuildModelResult<$MemberStatus>>;
    };
  };
  member: {
    Status: () => BuildModelResult<$MemberStatus>;
    Base: () => BuildModelResult<$MemberBase>;
    Sensitive: () => BuildModelResult<$MemberSensitive>;
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
  schemaResolved: (__rawResolved) => {
    const { models } = new Database(client);
    const { MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatus, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover } = __rawResolved;

    return {
      _referenced: {
        paymentsAs: {
          Payer: () => PaymentAsPayer.map((raw) => buildRawData(models.Payment.__build).default(schemaRaw2rawData<$Payment>(raw)).build(builder)),
          Receiver: () => PaymentAsReceiver.map((raw) => buildRawData(models.Payment.__build).default(schemaRaw2rawData<$Payment>(raw)).build(builder)),
          Approver: () => PaymentAsApprover.map((raw) => buildRawData(models.Payment.__build).default(schemaRaw2rawData<$Payment>(raw)).build(builder)),
        },
        memberStatusAsUpdaterTo: {
          HasDeleted: () => MemberStatusAsUpdaterToHasDeleted.map((raw) => buildRawData(models.member.Status.__build).default(schemaRaw2rawData<$MemberStatus>(raw)).build(builder)),
          LastRenewalDate: () => MemberStatusAsUpdaterToLastRenewalDate.map((raw) => buildRawData(models.member.Status.__build).default(schemaRaw2rawData<$MemberStatus>(raw)).build(builder)),
        },
      },
      member: {
        Status: () => buildRawData(models.member.Status.__build).default(schemaRaw2rawData<$MemberStatus>(MemberStatus)).build(builder),
        Base: () => buildRawData(models.member.Base.__build).default(schemaRaw2rawData<$MemberBase>(MemberBase)).build(builder),
        Sensitive: () => buildRawData(models.member.Sensitive.__build).default(schemaRaw2rawData<$MemberSensitive>(MemberSensitive)).build(builder),
        detail: toMemberDetail(client, builder, { MemberAlumni, MemberActive, MemberActiveInternal, MemberActiveExternal }),
      },
    };
  },
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

  public static with(client: PrismaClient) {
    const __toUnwrappedInstances = ((rawData, builder) => ({
      default: new $Member(client, rawData, builder),
      withResolved: new $Member<'WITH_RESOLVED'>(client, rawData, builder),
    })) satisfies ModelUnwrappedInstances__DO_NOT_EXPOSE<ThisModel>;

    const buildErr = Database.dbErrorWith(metadata).transformBuildModel('toInstances');
    const toInstances = ((rawData, builder) => match(builder)
      .with({ type: 'ANONYMOUS' }, () => err(buildErr({ type: 'PERMISSION_DENIED', detail: { builder } } as const)))
      .with({ type: 'SELF' }, () => ok(__toUnwrappedInstances(rawData, builder)))
      .with({ type: 'MEMBER' }, ({ member }) => {
        // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
        if (SECURITY_ROLE.indexOf(member.data.securityRole) >= SECURITY_ROLE.indexOf('MEMBER')) {
          return err(buildErr({ type: 'PERMISSION_DENIED', detail: { builder } } as const));
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
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('from'))
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
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('fromWithResolved'))
        // FIXME: もっと良い書き方あるかも
          .map(({ MemberBase, MemberSensitive, MemberStatus, ...rest }) => {
            // NOTE:
            //  Nullable なモデルは, Prisma の `Member` モデルに関連する 1:1 のスキーマ定義を参考のこと.
            //  ただし, `SchemaResolvedRaw` の Nullable は除く.
            //  refs:
            //   - https://github.com/SystemEngineeringTeam/meibo-system-v3/blob/86d29333aae5e7c0afe889f36081b622959d07a7/prisma/schema.prisma#L26-L33
            //   - https://github.com/SystemEngineeringTeam/meibo-system-v3/blob/86d29333aae5e7c0afe889f36081b622959d07a7/app/models/member.ts#L69-L72
            if (MemberBase == null) throw new Error('不正なデータ: `MemberBase` が取得できませんでした');
            if (MemberSensitive == null) throw new Error('不正なデータ: `MemberSensitive` が取得できませんでした');
            if (MemberStatus == null) throw new Error('不正なデータ: `MemberStatus` が取得できませんでした');
            const d = { MemberBase, MemberSensitive, MemberStatus, ...rest };

            return separateRawData<ThisModel, IncludeKey>(includeKeys).withResolved(d);
          });
        return rawData.map(buildRawData(__build).withResolved);
      },
      fetchMany: (args) => {
        const rawDataList = Database.transformResult(
          client.member.findMany(args),
        )
          .mapErr(Database.dbErrorWith(metadata).transformPrismaBridge('fetchMany'))
          .map((r) => r.map(separateRawData<ThisModel, IncludeKey>(includeKeys).default));

        return rawDataList.map((ms) => ({
          build: (builder) => ms.map((r) => buildRawData(__build).default(r).build(builder)),
          buildBy: (memberAsBuilder) => ms.map((r) => buildRawData(__build).default(r).buildBy(memberAsBuilder)),
          buildBySelf: () => ms.map((r) => buildRawData(__build).default(r).buildBySelf()),
        }));
      },
    } satisfies ModelBuilder<ThisModel>;
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $Member.with(this.client).fromWithResolved(this.data.id),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    return Database.transformResult(
      this.client.member.update({ data, where: { id: this.data.id } }),
    )
      .mapErr(this.dbError.transformPrismaBridge('update'))
      .map((r) => buildRawData($Member.with(this.client).__build).default(schemaRaw2rawData<$Member>(r)))
      .map((r) => r.build(this.builder)._unsafeUnwrap());
  }

  public delete(): DatabaseResult<void> {
    return Database.transformResult(
      this.client.member.delete({ where: { id: this.data.id } }),
    )
      .mapErr(this.dbError.transformPrismaBridge('delete'))
      .map(() => undefined);
  }

  public hoge() { }
}
