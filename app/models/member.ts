import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { $Payment } from '@/models/payment';
import type { Model, ModelBuilder, ModelBuilderType, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelSerializer, ModeWithResolved, RelatedResponseClearerInclude } from '@/types/model';
import type { ArrayElem, Brand, Nullable, Override } from '@/types/utils';
import type { DatabaseResult } from '@/utils/errors/database';
import type {
  Prisma,
  PrismaClient,
  Member as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid, toBrand } from '@/utils';
import { DatabaseError, databaseWrapBridgeResult } from '@/utils/errors/database';
import { ModelOperationError } from '@/utils/errors/database/model-operation';
import { type MemberDetail, toMemberDetail } from '@/utils/member';
import { includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok, safeTry } from 'neverthrow';
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
      Payer: () => $Payment[];
      Receiver: () => $Payment[];
      Approver: () => $Payment[];
    };
    memberStatusAsUpdaterTo: {
      HasDeleted: () => $MemberStatus[];
      LastRenewalDate: () => $MemberStatus[];
    };
  };
  member: {
    Status: () => $MemberStatus;
    Base: () => $MemberBase;
    Sensitive: () => $MemberSensitive;
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

/// Serializer ///

const serializer = ((client, builder) => ({
  schema: {
    fromRaw: (__raw) => ({
      ...__raw,
      id: MemberId.from(__raw.id)._unsafeUnwrap(),
      subject: Subject.from(__raw.subject),
      securityRole: zSecurityRoles.parse(__raw.securityRole),
    }),
    toRaw: (data) => ({
      ...data,
      subject: data.subject,
      securityRole: data.securityRole,
    }),
  },
  schemaResolved: {
    fromRaw: (__rawResolved) => {
      const { models } = new Database(client);
      const { MemberBase, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, MemberStatus, MemberStatusAsUpdaterToHasDeleted, MemberStatusAsUpdaterToLastRenewalDate, PaymentAsPayer, PaymentAsReceiver, PaymentAsApprover } = __rawResolved;
      // eslint-disable-next-line func-style
      const p = (__raw: ModelSchemaRawOf<$Payment>) => models.Payment(builder).__build(schemaRaw2rawData<$Payment>(__raw));

      return {
        _referenced: {
          paymentsAs: {
            Payer: () => PaymentAsPayer.map(p),
            Receiver: () => PaymentAsReceiver.map(p),
            Approver: () => PaymentAsApprover.map(p),
          },
          memberStatusAsUpdaterTo: {
            HasDeleted: () => MemberStatusAsUpdaterToHasDeleted.map((raw) => models.member.Status(builder).__build(schemaRaw2rawData<$MemberStatus>(raw))),
            LastRenewalDate: () => MemberStatusAsUpdaterToLastRenewalDate.map((raw) => models.member.Status(builder).__build(schemaRaw2rawData<$MemberStatus>(raw))),
          },
        },
        member: {
          Status: () => models.member.Status(builder).__build(schemaRaw2rawData<$MemberStatus>(MemberStatus)),
          Base: () => models.member.Base(builder).__build(schemaRaw2rawData<$MemberBase>(MemberBase)),
          Sensitive: () => models.member.Sensitive(builder).__build(schemaRaw2rawData<$MemberSensitive>(MemberSensitive)),
          detail: toMemberDetail(client, builder, { MemberAlumni, MemberActive, MemberActiveInternal, MemberActiveExternal }),
        },
      };
    },
    toRaw: (data) => ({
      MemberBase: data.member.Base().__raw,
      MemberSensitive: data.member.Sensitive().__raw,
      MemberStatus: data.member.Status().__raw,
      MemberActive: data.member.detail.type === 'ACTIVE' ? data.member.detail.Data().__raw : null,
      MemberActiveInternal: (data.member.detail.type === 'ACTIVE' && data.member.detail.activeType === 'INTERNAL') ? data.member.detail.ActiveData().__raw : null,
      MemberActiveExternal: (data.member.detail.type === 'ACTIVE' && data.member.detail.activeType === 'EXTERNAL') ? data.member.detail.ActiveData().__raw : null,
      MemberAlumni: data.member.detail.type === 'ALUMNI' ? data.member.detail.Data().__raw : null,
      MemberStatusAsUpdaterToHasDeleted: data._referenced.memberStatusAsUpdaterTo.HasDeleted().map((m) => m.__raw),
      MemberStatusAsUpdaterToLastRenewalDate: data._referenced.memberStatusAsUpdaterTo.LastRenewalDate().map((m) => m.__raw),
      PaymentAsPayer: data._referenced.paymentsAs.Payer().map((m) => m.__raw),
      PaymentAsReceiver: data._referenced.paymentsAs.Receiver().map((m) => m.__raw),
      PaymentAsApprover: data._referenced.paymentsAs.Approver().map((m) => m.__raw),
    }),
  },
})) satisfies ModelSerializer<ThisModel>;

/// Utils ///

const dbError = DatabaseError.createWith(metadata);
const separateRD = separateRawData<ThisModel, IncludeKey>(includeKeys);

/**
 * Prisma のリレーションの解決済みレスポンスを RawData に変換する.
 * レスポンスが Nullable なモデルは, Prisma の `Member` モデルに関連する 1:1 のスキーマ定義を参考のこと.
 * ただし, `SchemaResolvedRaw` の Nullable は除く.
 * @throws {Error} DB のレスポンスが不正なデータ (状態) の場合 – catch 不要
 * refs:
 *   - https://github.com/SystemEngineeringTeam/meibo-system-v3/blob/86d29333aae5e7c0afe889f36081b622959d07a7/prisma/schema.prisma#L26-L33
 *   - https://github.com/SystemEngineeringTeam/meibo-system-v3/blob/86d29333aae5e7c0afe889f36081b622959d07a7/app/models/member.ts#L69-L72
 */
function clearRelatedResponse(res: Prisma.MemberGetPayload<RelatedResponseClearerInclude<IncludeKey>>): SchemaRaw & SchemaResolvedRaw {
  const { MemberBase, MemberSensitive, MemberStatus, ...rest } = res;
  if (MemberBase == null) throw new Error('不正なデータ: `MemberBase` が取得できませんでした');
  if (MemberSensitive == null) throw new Error('不正なデータ: `MemberSensitive` が取得できませんでした');
  if (MemberStatus == null) throw new Error('不正なデータ: `MemberStatus` が取得できませんでした');
  return ({ MemberBase, MemberSensitive, MemberStatus, ...rest });
}

/// Model ///

export class $Member<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
  public declare __struct: ThisModelImpl<Mode>;
  public declare __variants: ThisModelVariants;

  public __prisma: PrismaClient;

  private serialized: ReturnType<typeof serializer>;

  public constructor(
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
      __build: (args) => new $Member(client, args, builder),

      from: (id: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.member.findUniqueOrThrow({ where: { id } }),
        ).map(schemaRaw2rawData<ThisModel>);

        return ok(new $Member(client, rawData, builder));
      }).mapErr(dbError('from')),

      fromSubject: (subject: Subject) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.member.findUniqueOrThrow({ where: { subject } }),
        ).map(schemaRaw2rawData<ThisModel>);

        return ok(new $Member(client, rawData, builder));
      }).mapErr(dbError('fromSubject')),

      fromWithResolved: (id: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.member.findUniqueOrThrow({
            where: { id },
            include: includeKeys2select(includeKeys),
          }),
        )
          .map(clearRelatedResponse)
          .map(separateRD.withResolved);

        return ok(new $Member<'WITH_RESOLVED'>(client, rawData, builder));
      }).mapErr(dbError('fromWithResolved')),

      fromSubjectWithResolved: (subject: Subject) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.member.findUniqueOrThrow({
            where: { subject },
            include: includeKeys2select(includeKeys),
          }),
        )
          .map(clearRelatedResponse)
          .map(separateRD.withResolved);

        return ok(new $Member<'WITH_RESOLVED'>(client, rawData, builder));
      }).mapErr(dbError('fromSubjectWithResolved')),

      findMany: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.member.findMany(args),
        ).map((ms) => ms.map(schemaRaw2rawData<ThisModel>));

        return ok(rawData.map((data) => new $Member(client, data, builder)));
      }).mapErr(dbError('findMany')),

      findManyWithResolved: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.member.findMany({
            ...args,
            include: includeKeys2select(includeKeys),
          }),
        )
          .map((ms) => ms.map(clearRelatedResponse).map(separateRD.withResolved));

        return ok(rawData.map((data) => new $Member<'WITH_RESOLVED'>(client, data, builder)));
      }).mapErr(dbError('findManyWithResolved')),
    } as const satisfies ModelBuilder<ThisModel>);
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $Member.with(this.client)(this.builder).fromWithResolved(this.data.id),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    const __raw = this.serialized.schema.toRaw({ ...this.data, ...data });
    return databaseWrapBridgeResult(
      this.client.member.update({ data: __raw, where: { id: this.data.id } }),
    )
      .mapErr(dbError('update'))
      .map(separateRD.default)
      .map((r) => new $Member(this.client, r, this.builder));
  }

  public delete(): DatabaseResult<void> {
    return databaseWrapBridgeResult(
      this.client.member.delete({ where: { id: this.data.id } }),
    )
      .mapErr(dbError('delete'))
      .map(() => undefined);
  }
}
