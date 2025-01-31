import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Brand, Override } from '@/types/utils';
import type { $MemberBase } from '@/utils/models/member/base';
import type {
  Prisma,
  PrismaClient,
  Member as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid, toBrand } from '@/utils';
import { includeKeys2select, matchWithDefault, matchWithResolved } from '@/utils/model';
import { errAsync } from 'neverthrow';
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
 * セキュリティーロール – 上に行くほど権限が強いです.
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
};

interface SchemaResolved {
  Base: () => ModelEntityOf<$MemberBase>;
}

/// Model ///

export const __Member = (<M extends ModelMode>(client: PrismaClient) => class Member<Mode extends ModelMode = M> {
  public static __prisma = client;

  private dbError = Database.dbErrorWith(metadata);
  private models = new Database(client).models;

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  public constructor(__raw: SchemaRaw);
  public constructor(__raw: SchemaRaw, __rawResolved: SchemaResolvedRaw);

  public constructor(__raw: SchemaRaw, __rawResolved?: SchemaResolvedRaw) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      id: MemberId.from(__raw.id)._unsafeUnwrap(),
      subject: Subject.from(__raw.subject),
      securityRole: zSecurityRoles.parse(__raw.securityRole),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        Base: () => new this.models.member.Base(r.MemberBase),
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<Member> {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new Member(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<Member<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.member.findUniqueOrThrow({
        where: { id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ MemberBase, ...rest }) => new Member(rest, { MemberBase: MemberBase! }));
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
        .map(({ MemberBase, ...rest }) => new Member(rest, { MemberBase: MemberBase! })),
    );
  }

  public update(operator: Member, data: Partial<Schema>): DatabaseResult<Member> {
    // TODO: 後で権限ロジックの外部化をする
    if (operator.data.securityRole !== 'OWNER') {
      return errAsync(this.dbError.create('update')({
        type: 'PERMISSION_DENIED',
        _raw: { operator },
      }));
    }

    return Database.transformResult(
      client.member.update({ data, where: { id: this.data.id } }),
    )
      .mapErr(this.dbError.transform('update'))
      .map((m) => new Member(m));
  }

  public delete(_operator: Member): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $Member<M extends ModelMode = 'DEFAULT'> = typeof __Member<M>;
