/* eslint-disable ts/no-redeclare */

import type { ModelGenerator, ModelMetadata } from '@/types/model';
import type { ArrayElem, Brand, Override } from '@/types/utils';
import type { Member as _Member } from '@prisma/client';
import { parseUuid } from '@/utils';
import { Model } from '@/utils/model';

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

export type MemberId = Brand<'memberId', string>;
export const MemberId = {
  from: parseUuid<'memberId'>,
};

type Schema = Override<
  _Member,
  {
    id: MemberId;
    subject: Brand<'subject', string>;
    securityRole: SecurityRole;
  }
>;

const metadata = {
  displayName: '部員',
  modelName: 'Member',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'Member'>;

export const __Member = (
  (client) =>
    class Member extends Model<typeof metadata, Schema> {
      public constructor(data: Schema) {
        super(data, metadata);
      }

      public static factories = this.getFactories<MemberId, Member>(client)(Member, metadata);
    }
  ) satisfies ModelGenerator<typeof metadata, Schema>;
