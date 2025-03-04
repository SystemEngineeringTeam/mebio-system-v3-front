import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberActiveExternal as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
import { err, ok } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: '現役生 (外部) の情報',
  modelName: 'memberActiveExternal',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberActiveExternal'>;

/// Custom Types ///

/* TODO */

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
  }
>;

type IncludeKey = keyof Prisma.MemberActiveExternalInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => BuildModelResult<ModelEntityOf<$Member>>;
  };
}

type RawData = ModelRawData4build<SchemaRaw, SchemaResolvedRaw>;

/// Model ///

export const __MemberActiveExternal = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberActiveExternal<Mode extends ModelMode = M> {
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
    };

    const { models } = new Database(client);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => models.Member.__build({ __raw: r.Member }, builder),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static __build(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<MemberActiveExternal<'DEFAULT'>> {
    const isSelf = builder == null;
    if (isSelf) {
      return ok(new MemberActiveExternal(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new MemberActiveExternal(rawData, builder));
  }

  public static from(id: MemberId, builder: ModelEntityOf<$Member>): DatabaseResult<BuildModelResult<MemberActiveExternal<'DEFAULT'>>> {
    return Database.transformResult(
      client.memberActiveExternal.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => MemberActiveExternal.__build({ __raw }, builder));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberActiveExternal<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberActiveExternal.findUniqueOrThrow({
        where: { memberId: id },
        // TODO: `MemberBase` と `Member` を一緒に JOIN する書き方を考える.  一旦, 1:1 の `Member` だけ include.
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ Member, ...__raw }) => new MemberActiveExternal({ __raw, __rawResolved: { Member } }));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_data: Partial<Schema>): DatabaseResult<MemberActiveExternal> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberActiveExternal<M extends ModelMode = 'DEFAULT'> = ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> & typeof __MemberActiveExternal<M>;
