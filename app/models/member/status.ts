import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberStatus as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, matchWithResolved } from '@/utils/model';
import { err, ok } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: '部員のステータス',
  modelName: 'memberStatus',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberStatus'>;

/// Custom Types ///

/* TODO */

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    updatedHasDeletedById: MemberId;
    updatedLastRenewalDateById: MemberId;
  }
>;

type IncludeKey = keyof Prisma.MemberStatusInclude;
const includeKeys = ['Member', 'UpdatedHasDeletedBy', 'UpdatedLastRenewalDateBy'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  UpdatedHasDeletedBy: ModelSchemaRawOf<$Member>;
  UpdatedLastRenewalDateBy: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => BuildModelResult<ModelEntityOf<$Member>>;
  };
  updaterTo: {
    hasDeleted: () => BuildModelResult<ModelEntityOf<$Member>>;
    lastRenewalDate: () => BuildModelResult<ModelEntityOf<$Member>>;
  };
}

type RawData = ModelRawData4build<SchemaRaw, SchemaResolvedRaw>;

/// Model ///

export const __MemberStatus = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberStatus<Mode extends ModelMode = M> {
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
      updatedHasDeletedById: MemberId.from(__raw.updatedHasDeletedById)._unsafeUnwrap(),
      updatedLastRenewalDateById: MemberId.from(__raw.updatedLastRenewalDateById)._unsafeUnwrap(),
    };

    const { models } = new Database(client);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => models.Member.__build({ __raw: r.Member }, builder),
        },
        updaterTo: {
          hasDeleted: () => models.Member.__build({ __raw: r.UpdatedHasDeletedBy }, builder),
          lastRenewalDate: () => models.Member.__build({ __raw: r.UpdatedLastRenewalDateBy }, builder),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static __build(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<MemberStatus<'DEFAULT'>> {
    const isSelf = builder == null;
    if (isSelf) {
      return ok(new MemberStatus(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new MemberStatus(rawData, builder));
  }

  public static from(id: MemberId, builder: ModelEntityOf<$Member>): DatabaseResult<BuildModelResult<MemberStatus<'DEFAULT'>>> {
    return Database.transformResult(
      client.memberStatus.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => MemberStatus.__build({ __raw }, builder));
  }

  public static fromWithResolved(id: MemberId): DatabaseResult<MemberStatus<'WITH_RESOLVED'>> {
    return Database.transformResult(
      client.memberStatus.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(
        (
          { Member, UpdatedHasDeletedBy, UpdatedLastRenewalDateBy, ...__raw },
        ) => new MemberStatus(
          {
            __raw,
            __rawResolved: { Member, UpdatedHasDeletedBy, UpdatedLastRenewalDateBy },
          },
        ),
      );
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberStatus<'DEFAULT'>> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $MemberStatus<M extends ModelMode = 'DEFAULT'> = ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> & typeof __MemberStatus<M>;
