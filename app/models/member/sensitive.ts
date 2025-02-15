import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberSensitive as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '部員の非公開情報',
  modelName: 'memberSensitive',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberSensitive'>;

/// Custom Types ///

export const GENDER = ['male', 'female', 'other'] as const;
const zGender = z.enum(GENDER);
type Gender = ArrayElem<typeof GENDER>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    birthday: Date;
    gender: Gender;
    createdAt: Date;
    updatedAt: Date;
  }
>;

type IncludeKey = keyof Prisma.MemberSensitiveInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => ModelEntityOf<$Member>;
  };
}

/// Model ///

export const __MemberSensitive = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberSensitive<Mode extends ModelMode = M> {
  public static __prisma = client;
  private dbError = Database.dbErrorWith(metadata);

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  public constructor(__raw: SchemaRaw, __rawResolved?: SchemaResolvedRaw) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
      birthday: new Date(__raw.birthday),
      gender: zGender.parse(__raw.gender),
    };

    const { models } = new Database(client);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => new models.Member(r.Member),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: MemberId): DatabaseResult<MemberSensitive<'DEFAULT'>> {
    return Database.transformResult(
      client.memberSensitive.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberSensitive(data));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberSensitive<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberSensitive.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ Member, ...rest }) => new MemberSensitive(rest, { Member: Member! }));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberSensitive> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberSensitive<M extends ModelMode = 'DEFAULT'> = ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> & typeof __MemberSensitive<M>;
