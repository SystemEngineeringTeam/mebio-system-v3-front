import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModeWithResolved } from '@/types/model';
import type { Override } from '@/types/utils';
import type {
  Prisma,
  PrismaClient,
  MemberAlumni as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { includeKeys2select, isSelf, matchWithDefault, matchWithResolved } from '@/utils/model';
import { err, ok } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: '卒業生の情報',
  modelName: 'memberAlumni',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberAlumni'>;

/// Custom Types ///

/* TODO */

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
  }
>;

type IncludeKey = keyof Prisma.MemberAlumniInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => BuildModelResult<ModelEntityOf<$Member>>;
  };
}

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, ModelGen>;
type RawData = ModelRawData4build<ThisModel>;

/// Model ///

export const __MemberAlumni = (<Mode extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class MemberAlumni implements ThisModel<Mode> {
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

  public static __build(rawData: { __raw: SchemaRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'DEFAULT'>>;
  public static __build(rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
  public static __build<M extends ModelMode>(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<M>> {
    const Model = __MemberAlumni<M>(client);
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
      client.memberAlumni.findUniqueOrThrow({
        where: { memberId: id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => ({
        buildBy: (builder: ModelEntityOf<$Member>) => MemberAlumni.__build({ __raw }, builder),
        buildBySelf: () => MemberAlumni.__build({ __raw }),
      }));
  }

  public static fromWithResolved(id: MemberId) {
    const rawData = Database.transformResult(
      client.memberAlumni.findUniqueOrThrow({
        where: { memberId: id },
        include: includeKeys2select(includeKeys),
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('fromWithResolved'))
      .map(({ Member, ...__raw }) => ({ __raw, __rawResolved: { Member } }));

    return rawData.map(({ __raw, __rawResolved }) => ({
      buildBy: (builder: ModelEntityOf<$Member>) => MemberAlumni.__build({ __raw, __rawResolved }, builder),
      buildBySelf: () => MemberAlumni.__build({ __raw, __rawResolved }),
    }));
  }

  public resolveRelation() {
    const rawData = matchWithDefault(
      this.__rawResolved,
      () => Database.transformResult(
        client.memberAlumni.findUniqueOrThrow({
          where: { memberId: this.data.memberId },
          include: includeKeys2select(includeKeys),
        }),
      )
        .mapErr(this.dbError.transform('resolveRelation'))
        .map(({ Member, ...__raw }) => ({ __raw, __rawResolved: { Member } })),
    );

    return rawData.map(({ __raw, __rawResolved }) => ({
      buildBy: (builder: ModelEntityOf<$Member>) => MemberAlumni.__build({ __raw, __rawResolved }, builder),
      buildBySelf: () => MemberAlumni.__build({ __raw, __rawResolved }),
    }));
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<MemberAlumni> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGen;

export type $MemberAlumni<M extends ModelMode = 'DEFAULT'> = ModelGen & typeof __MemberAlumni<M>;
