import type { DatabaseResult } from '@/types/database';
import type { ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Override } from '@/types/utils';
import type { $Member } from '@/models/member';
import type {
  Prisma,
  PrismaClient,
  MemberActive as SchemaRaw,
} from '@prisma/client';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
import { MemberId } from '@/models/member';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '現役部員の情報',
  modelName: 'memberActive',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberActive'>;

/// Custom Types ///

export const GRADES = ['B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2', 'D3'] as const;
export const zGrades = z.enum(GRADES);
export type Grade = ArrayElem<typeof GRADES>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    grade: Grade;
  }
>;

type IncludeKey = keyof Prisma.MemberActiveInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: ModelEntityOf<$Member>;
  };
}

/// Model ///

export const __MemberActive = (<M extends ModelMode>(client: PrismaClient) => class MemberActive<Mode extends ModelMode = M> {
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
      grade: zGrades.parse(__raw.grade),
    };

    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: new this.models.Member(r.Member),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static from(id: any): DatabaseResult<MemberActive> {
    return Database.transformResult(
      client.memberActive.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((data) => new MemberActive(data));
  }

  public static fromWithResolved(id: any): DatabaseResult<MemberActive<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberActive.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ Member, ...rest }) => new MemberActive(rest, { Member: Member! }));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberActive> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberActive<M extends ModelMode = 'DEFAULT'> = typeof __MemberActive<M> & ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
