import type { $Member } from '@/models/member';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { Model, ModelBuilder, ModelBuilderType, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelSerializer, ModeWithResolved, RelatedResponseClearerInclude } from '@/types/model';
import type { ArrayElem, Nullable, Override } from '@/types/utils';
import type { DatabaseResult } from '@/utils/errors/database';
import type {
  Prisma,
  PrismaClient,
  MemberActive as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { DatabaseError, databaseWrapBridgeResult } from '@/utils/errors/database';
import { ModelOperationError } from '@/utils/errors/database/model-operation';
import { type MemberDetailActive, toMemberDetailActive } from '@/utils/member';
import { includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok, ResultAsync, safeTry } from 'neverthrow';
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

type IncludeKey = keyof Prisma.MemberActiveInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];
const includeKeysRelated = ['MemberActiveInternal', 'MemberActiveExternal'] as const;

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
  MemberActiveInternal: Nullable<ModelSchemaRawOf<$MemberActiveInternal>>;
  MemberActiveExternal: Nullable<ModelSchemaRawOf<$MemberActiveExternal>>;
}

type SchemaResolved = {
  _parent: {
    Member: () => $Member;
  };
} & MemberDetailActive;

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $MemberActive<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
type RawData = ModelRawData4build<ThisModel>;

/// Serializer ///

const serializer = ((client, builder) => ({
  schema: {
    fromRaw: (__raw) => ({
      ...__raw,
      memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
      grade: zGrades.parse(__raw.grade),
    }),
    toRaw: (data) => ({ ...data }),
  },
  schemaResolved: {
    fromRaw: (__rawResolved) => {
      const { models } = new Database(client);
      const { Member, MemberActiveInternal, MemberActiveExternal } = __rawResolved;

      return {
        _parent: {
          Member: () => models.Member(builder).__build(schemaRaw2rawData<$Member>(Member)),
        },
        ...toMemberDetailActive(client, builder, { MemberActiveExternal, MemberActiveInternal }),
      };
    },
    toRaw: (data) => ({
      Member: data._parent.Member().__raw,
      MemberActiveInternal: data.activeType === 'INTERNAL' ? data.ActiveData().__raw : null,
      MemberActiveExternal: data.activeType === 'EXTERNAL' ? data.ActiveData().__raw : null,
    }),
  },

})) satisfies ModelSerializer<ThisModel>;

/// Utils ///

const separateRD = separateRawData<ThisModel, IncludeKey>(includeKeys);
const dbError = DatabaseError.createWith(metadata);
function processRawRelated(res: Prisma.MemberGetPayload<RelatedResponseClearerInclude<ArrayElem<typeof includeKeysRelated>>>) {
  const { MemberActiveExternal, MemberActiveInternal, ...Member } = res;
  return { Member, MemberActiveExternal, MemberActiveInternal };
};

/// Model ///

export class $MemberActive<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
  public declare __struct: ThisModelImpl<Mode>;
  public declare __variants: ThisModelVariants;

  public __prisma: PrismaClient;

  private serialized: ReturnType<typeof serializer>;

  public constructor(
    private client: PrismaClient,
    private rawData: RawData,
    private builder: ModelBuilderType,
  ) {
    this.__prisma = client;
    this.serialized = serializer(client, this.builder);
  }

  public get __raw(): SchemaRaw {
    return this.rawData.__raw;
  }

  public get data(): Schema {
    return this.serialized.schema.fromRaw(this.rawData.__raw);
  }

  public get __rawResolved(): ModeWithResolved<Mode, SchemaResolvedRaw> {
    return matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(this.rawData.__rawResolved, this.serialized.schemaResolved.fromRaw).rawResolved;
  }

  public get dataResolved(): ModeWithResolved<Mode, SchemaResolved> {
    return matchWithResolved<Mode, SchemaResolvedRaw, SchemaResolved>(this.rawData.__rawResolved, this.serialized.schemaResolved.fromRaw).dataResolved;
  }

  public static with(client: PrismaClient) {
    return (builder: ModelBuilderType) => ({
      __build: (args: RawData) => new $MemberActive(client, args, builder),

      from: (memberId: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.memberActive.findUniqueOrThrow({ where: { memberId } }),
        ).map(separateRD.default);

        return ok(new $MemberActive(client, rawData, builder));
      }).mapErr(dbError('from')),

      fromWithResolved: (memberId: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const [__raw, __rawResolved] = yield * await ResultAsync.combine([
          databaseWrapBridgeResult(
            client.memberActive.findUniqueOrThrow({ where: { memberId }, include: includeKeys2select(includeKeys) }),
          ),
          databaseWrapBridgeResult(
            client.member.findUniqueOrThrow({ where: { id: memberId }, include: includeKeys2select(includeKeysRelated) }),
          ).map(processRawRelated),
        ]);
        const rawData: RawData = { __raw, __rawResolved };

        return ok(new $MemberActive<'WITH_RESOLVED'>(client, rawData, builder));
      }).mapErr(dbError('fromWithResolved')),

      findMany: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.memberActive.findMany(args),
        ).map((ms) => ms.map(separateRD.default));

        return ok(rawData.map((data) => new $MemberActive(client, data, builder)));
      }).mapErr(dbError('fetchMany')),

      /// WARN: expensive!!!  order: O(2n)
      findManyWithResolved: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const [__raw, __rawResolved] = yield * await ResultAsync.combine([
          databaseWrapBridgeResult(
            client.memberActive.findMany({
              ...args,
              include: includeKeys2select(includeKeys),
              orderBy: { memberId: 'asc' },
            }),
          ),
          databaseWrapBridgeResult(
            client.member.findMany({
              orderBy: { id: 'asc' },
              include: includeKeys2select(includeKeysRelated),
            }),
          ).map((ms) => ms.map(processRawRelated)),
        ]);

        const map = new Map<string, ArrayElem<typeof __rawResolved>>();
        __rawResolved.forEach((d) => {
          map.set(d.Member.id, d);
        });
        const rawData = __raw.map((d) => {
          const resolved = map.get(d.memberId.toString());
          if (resolved == null) throw new Error('不正なデータ: `Member` が取得できませんでした');
          return { __raw: d, __rawResolved: resolved };
        });

        return ok(rawData.map((data) => new $MemberActive<'WITH_RESOLVED'>(client, data, builder)));
      }).mapErr(dbError('findManyWithResolved')),

    } as const satisfies ModelBuilder<ThisModel>);
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $MemberActive.with(this.client)(this.builder).fromWithResolved(this.data.memberId),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    const __raw = this.serialized.schema.toRaw({ ...this.data, ...data });
    return databaseWrapBridgeResult(
      this.client.memberActive.update({ data: __raw, where: { memberId: this.data.memberId } }),
    )
      .mapErr(dbError('update'))
      .map(separateRD.default)
      .map((r) => new $MemberActive(this.client, r, this.builder));
  }

  public delete(): DatabaseResult<void> {
    return databaseWrapBridgeResult(
      this.client.memberActive.delete({ where: { memberId: this.data.memberId } }),
    )
      .mapErr(dbError('delete'))
      .map(() => undefined);
  }
}
