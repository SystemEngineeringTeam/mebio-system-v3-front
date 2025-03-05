import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberStatus as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, isSelf, matchWithResolved } from '@/utils/model';
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

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, ModelGen>;
type RawData = ModelRawData4build<ThisModel>;

/// Model ///

export const __MemberStatus = (<Mode extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberStatus implements ThisModel<Mode> {
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

  public static __build(rawData: { __raw: SchemaRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'DEFAULT'>>;
  public static __build(rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
  public static __build<M extends ModelMode>(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<M>> {
    const Model = __MemberStatus<M>(client);
    if (isSelf(builder)) {
      return ok(new Model(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new Model(rawData, builder));
  }

  public static from(id: MemberId) {
    return Database.transformResult(
      client.memberStatus.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => ({
        buildBy: (builder: ModelEntityOf<$Member>) => MemberStatus.__build({ __raw }, builder),
        buildBySelf: () => MemberStatus.__build({ __raw }),
      }));
  }

  public static fromWithResolved(id: MemberId) {
    const rawData = Database.transformResult(
      client.memberStatus.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map((
        { Member, UpdatedHasDeletedBy, UpdatedLastRenewalDateBy, ...__raw },
      ) => ({
        __raw,
        __rawResolved: { Member, UpdatedHasDeletedBy, UpdatedLastRenewalDateBy },
      }));

    return rawData.map(({ __raw, __rawResolved }) => ({
      buildBy: (builder: ModelEntityOf<$Member>) => MemberStatus.__build({ __raw, __rawResolved }, builder),
      buildBySelf: () => MemberStatus.__build({ __raw, __rawResolved }),
    }));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_data: Partial<Schema>): DatabaseResult<ThisModel> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGen;

export type $MemberStatus<M extends ModelMode = 'DEFAULT'> = ModelGen & typeof __MemberStatus<M>;
