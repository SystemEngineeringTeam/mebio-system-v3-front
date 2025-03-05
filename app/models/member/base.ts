import type { $Member } from '@/models/member';
import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Nullable, Override } from '@/types/utils';
import type { MemberDetail } from '@/utils/member';
import type {
  PrismaClient,
  MemberBase as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { toMemberDetail } from '@/utils/member';
import { includeKeys2select, isSelf, matchWithResolved } from '@/utils/model';
import { err, ok, ResultAsync } from 'neverthrow';

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

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  MemberStatus: ModelSchemaRawOf<$MemberStatus>;
  MemberSensitive: ModelSchemaRawOf<$MemberSensitive>;
  MemberActive: Nullable<ModelSchemaRawOf<$MemberActive>>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
  MemberAlumni: Nullable<ModelSchemaRawOf<$MemberAlumni>>;
}

interface SchemaResolved {
  _parent: {
    Member: () => BuildModelResult<ModelEntityOf<$Member>>;
  };
  member: {
    Status: () => BuildModelResult<ModelEntityOf<$MemberStatus>>;
    Sensitive: () => BuildModelResult<ModelEntityOf<$MemberSensitive>>;
    detail: MemberDetail;
  };
}

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, ModelGen>;
type RawData = ModelRawData4build<ThisModel>;

/// Model ///

export const __MemberBase = (<Mode extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberBase implements ThisModel<Mode> {
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
      iconUrl: new URL(__raw.iconUrl),
    };

    const { models } = new Database(client);
    const { rawResolved, dataResolved } = matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(
      __rawResolved,
      (r) => ({
        _parent: {
          Member: () => models.Member.__build({ __raw: r.Member }, builder),
        },
        member: {
          Status: () => models.member.Status.__build({ __raw: r.MemberStatus }, builder),
          Sensitive: () => models.member.Sensitive.__build({ __raw: r.MemberSensitive }, builder),
          detail: toMemberDetail(client, { MemberActive: r.MemberActive, MemberActiveInternal: r.MemberActiveInternal, MemberActiveExternal: r.MemberActiveExternal, MemberAlumni: r.MemberAlumni }),
        },
      }),
    );

    this.__rawResolved = rawResolved;
    this.dataResolved = dataResolved;
  }

  public static __build(rawData: { __raw: SchemaRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'DEFAULT'>>;
  public static __build(rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
  public static __build<M extends ModelMode>(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<M>> {
    const Model = __MemberBase<M>(client);
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
      client.memberBase.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => ({
        buildBy: (builder: ModelEntityOf<$Member>) => MemberBase.__build({ __raw }, builder),
        buildBySelf: () => MemberBase.__build({ __raw }),
      }));
  }

  public static fromWithResolved(id: MemberId) {
    const rawData = ResultAsync.combine([
      Database.transformResult(
        client.memberBase.findUniqueOrThrow({
          where: { memberId: id },
        }),
      ),
      Database.transformResult(
        client.member.findUniqueOrThrow({
          where: { id },
          include: includeKeys2select(['MemberStatus', 'MemberSensitive', 'MemberActive', 'MemberActiveInternal', 'MemberActiveExternal', 'MemberAlumni']),
        }),
      ),
    ])
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map((
        [__raw, { MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, ...Member }],
      ) => ({
        __raw,
        __rawResolved: { Member, MemberStatus: MemberStatus!, MemberSensitive: MemberSensitive!, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni },
      }));

    return rawData.map(({ __raw, __rawResolved }) => ({
      buildBy: (builder: ModelEntityOf<$Member>) => MemberBase.__build({ __raw, __rawResolved }, builder),
      buildBySelf: () => MemberBase.__build({ __raw, __rawResolved }),
    }));
  }

  public resolveRelation(): DatabaseResult<SchemaResolved> {
    throw new Error('Method not implemented.');
  }

  public update(_data: Partial<Schema>): DatabaseResult<MemberBase> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }

  public hoge() { }
}
) satisfies ModelGen;

export type $MemberBase<M extends ModelMode = 'DEFAULT'> = ModelGen & typeof __MemberBase<M>;
