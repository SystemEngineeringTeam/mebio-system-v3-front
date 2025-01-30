import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type { $Member, __Member } from '@/utils/models/member';
import type {
  Prisma,
  MemberBase as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
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
    createdAt: Date;
    updatedAt: Date;
  }
>;

type IncludeKey = keyof Prisma.MemberBaseInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<typeof __Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => ModelEntityOf<typeof __Member>;
  };
}

/// Model ///

export const __MemberBase = ((client) => class MemberBase<Mode extends 'DEFAULT' | 'WITH_RESOLVED' = 'DEFAULT'> {
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
      memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
      iconUrl: new URL(__raw.iconUrl),
      createdAt: new Date(__raw.createdAt),
      updatedAt: new Date(__raw.updatedAt),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => new this.models.Member(r.Member),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<MemberBase> {
    return Database.transformResult(
      client.memberBase.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberBase(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberBase<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberBase.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ Member, ...rest }) => new MemberBase(rest, { Member: Member! }));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberBase> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }

  public hoge() { }
}
) satisfies ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberBase = typeof __MemberBase;
