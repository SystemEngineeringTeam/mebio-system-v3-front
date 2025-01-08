import type { ModelEntityOf, ModelGenerator, ModelMetadata } from '@/types/model';
import type { Override } from '@/types/utils';
import type { __Member } from '@/utils/models/member';
import type {
  Prisma,
  MemberBase as SchemaRaw,
} from '@prisma/client';
import { Model } from '@/utils/model';
import { MemberId } from '@/utils/models/member';

/// Metadata ///

const metadata = {
  displayName: '部員の基本情報',
  modelName: 'memberBase',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberBase'>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    iconUrl: URL;
  }
>;

type IncludeKey = keyof Prisma.MemberBaseInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

type SchemaResolved = Schema & {
  Member: ModelEntityOf<typeof __Member>;
};

/// Model ///

export const __MemberBase = (
  (client) =>
    class MemberBase extends Model<typeof metadata, SchemaRaw, Schema, SchemaResolved> {
      public static __prisma = client;
      public static factories = this.getFactories<MemberBase>(client)(MemberBase, metadata);

      public override data: Schema;
      public constructor(__raw: SchemaRaw) {
        super(metadata, __raw);

        this.data = {
          ...__raw,
          memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
          iconUrl: new URL(__raw.iconUrl),
        };
      }
    }

  ) satisfies ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolved>;
