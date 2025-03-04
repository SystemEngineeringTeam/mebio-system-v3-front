import type { $Member } from '@/models/member';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Nullable, Override } from '@/types/utils';
import type { MemberDetailActive } from '@/utils/member';
import type {
  PrismaClient,
  MemberActive as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { toMemberDetailActive } from '@/utils/member';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
import { err, ok, ResultAsync } from 'neverthrow';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '現役生の情報',
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

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
}

type SchemaResolved = {
  _parent: {
    Member: () => BuildModelResult<ModelEntityOf<$Member>>;
  };
} & MemberDetailActive;

type RawData = ModelRawData4build<SchemaRaw, SchemaResolvedRaw>;

/// Model ///

export const __MemberActive = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberActive<Mode extends ModelMode = M> {
  public static __prisma = client;

  private dbError = Database.dbErrorWith(metadata);

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: ModeWithResolved<Mode, SchemaResolvedRaw>;
  public dataResolved: ModeWithResolved<Mode, SchemaResolved>;

  private constructor({ __raw, __rawResolved }: RawData, private builder?: ModelEntityOf<$Member>) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
      grade: zGrades.parse(__raw.grade),
    };

    const { models } = new Database(client);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => models.Member.__build({ __raw: r.Member }, builder),
        },
        ...toMemberDetailActive(client, { MemberActiveInternal: r.MemberActiveInternal, MemberActiveExternal: r.MemberActiveExternal }),
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static __build(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<MemberActive<'DEFAULT'>> {
    const isSelf = builder == null;
    if (isSelf) {
      return ok(new MemberActive(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new MemberActive(rawData, builder));
  }

  public static from(id: MemberId, builder: ModelEntityOf<$Member>): DatabaseResult<BuildModelResult<MemberActive<'DEFAULT'>>> {
    return Database.transformResult(
      client.memberActive.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => MemberActive.__build({ __raw }, builder));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberActive<'WITH_RESOLVED'>> {
    return ResultAsync.combine([
      Database.transformResult(
        client.memberActive.findUniqueOrThrow({
          where: { memberId: id },
        }),
      ),
      Database.transformResult(
        client.member.findUniqueOrThrow({
          where: { id },
          include: includeKeys2select(['MemberActiveInternal', 'MemberActiveExternal']),
        }),
      ),
    ])
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(
        (
          [__raw, { MemberActiveInternal, MemberActiveExternal, ...Member }],
        ) => new MemberActive(
          {
            __raw,
            __rawResolved: {
              Member,
              MemberActiveInternal,
              MemberActiveExternal,
            },
          },
        ),
      );
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_data: Partial<Schema>): DatabaseResult<MemberActive> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberActive<M extends ModelMode = 'DEFAULT'> = ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> & typeof __MemberActive<M>;
