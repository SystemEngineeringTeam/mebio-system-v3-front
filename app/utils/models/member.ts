import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata } from '@/types/model';
import type { ArrayElem, Brand, Override } from '@/types/utils';
import type {
  Prisma,
  Member as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { fromEntries, parseUuid, toBrand } from '@/utils';
import { Model } from '@/utils/model';
import { __MemberBase } from '@/utils/models/member-base';

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
export const securityRoles = [
  'DEFAULT',
  'MEMBER',
  'READ',
  'PAYMENT_APPROVE',
  'OWNER',
] as const;
type SecurityRole = ArrayElem<typeof securityRoles>;

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

type SchemaResolved = Schema & {
  MemberBase: ModelEntityOf<typeof __MemberBase>;
};

/// Model ///

export const __Member = (
  (client) =>
    class Member extends Model<typeof metadata, SchemaRaw, Schema> {
      public override data: Schema;

      public constructor(__raw: SchemaRaw) {
        super(metadata, __raw);

        this.data = {
          ...__raw,
          id: MemberId.from(__raw.id)._unsafeUnwrap(),
          subject: Subject.from(__raw.subject),
          securityRole: __raw.securityRole as SecurityRole,
        };
      }

      public static __prisma = client;
      public static factories = {
        ...this.getFactories<Member>(client)(Member, metadata),
      };

      public resolveRelation(): DatabaseResult<SchemaResolved> {
        const select: Record<IncludeKey, true> = fromEntries(includeKeys.map((key) => [key, true]));
        const result = client.member.findUniqueOrThrow(
          {
            where: { id: this.data.id },
            select,
          },
        );

        return Database
          .transformResult(result)
          .map(
            (data) => ({
              ...data,
              MemberBase: new (__MemberBase(client))(data.MemberBase!),
            }),
          )
          .mapErr(this.transformError('resolveRelation'));
      }
    }

  ) satisfies ModelGenerator<typeof metadata, SchemaRaw, Schema>;

{
  const Member = __Member();
  const result = (await member);

  const w = result._unsafeUnwrap().MemberBase.data.createdAt;
}
