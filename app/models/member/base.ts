import type { $Member } from '@/models/member';
import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberSensitive } from '@/models/member/sensitive';
import type { $MemberStatus } from '@/models/member/status';
import type { Model, ModelBuilder, ModelBuilderType, ModelGenerator, ModelMetadata, ModelMode, ModelResolver, ModelSchemaRawOf, ModelSerializer, ModeWithResolved, RelatedResponseClearerInclude } from '@/types/model';
import type { ArrayElem, Nullable, Override } from '@/types/utils';
import type { DatabaseResult } from '@/utils/errors/database';
import type {
  Prisma,
  PrismaClient,
  MemberBase as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { DatabaseError, databaseWrapBridgeResult } from '@/utils/errors/database';
import { ModelOperationError } from '@/utils/errors/database/model-operation';
import { type MemberDetail, toMemberDetail } from '@/utils/member';
import { includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok, ResultAsync, safeTry } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: '部員の基本情報',
  modelName: 'memberBase',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberBase'>;

/// Custom Types ///

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    iconUrl: URL;
  }
>;

type IncludeKey = keyof Prisma.MemberBaseInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];
const includeKeysRelated = ['MemberStatus', 'MemberSensitive', 'MemberActive', 'MemberActiveInternal', 'MemberActiveExternal', 'MemberAlumni'] as const;

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
    Member: () => $Member;
  };
  member: {
    Status: () => $MemberStatus;
    Sensitive: () => $MemberSensitive;
    detail: MemberDetail;
  };
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $MemberBase<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
interface RawData { __raw: SchemaRaw; __rawResolved: Nullable<SchemaResolvedRaw> }

/// Serializer ///

const serializer = ((client, builder) => ({
  schema: {
    fromRaw: (__raw) => ({
      ...__raw,
      memberId: MemberId.from(__raw.memberId)._unsafeUnwrap(),
      iconUrl: new URL(__raw.iconUrl),
    }),
    toRaw: (data) => ({
      ...data,
      memberId: data.memberId,
      iconUrl: data.iconUrl.toString(),
    }),
  },
  schemaResolved: {
    fromRaw: (__rawResolved) => {
      const { models } = new Database(client);
      const { Member, MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni } = __rawResolved;
      return {
        _parent: {
          Member: () => models.Member(builder).__build(schemaRaw2rawData<$Member>(Member)),
        },
        member: {
          Status: () => models.member.Status(builder).__build(schemaRaw2rawData<$MemberStatus>(MemberStatus)),
          Sensitive: () => models.member.Sensitive(builder).__build(schemaRaw2rawData<$MemberSensitive>(MemberSensitive)),
          detail: toMemberDetail(client, builder, { MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni }),
        },
      };
    },
    toRaw: (data) => ({
      Member: data._parent.Member().__raw,
      MemberStatus: data.member.Status().__raw,
      MemberSensitive: data.member.Sensitive().__raw,
      MemberActive: data.member.detail.type === 'ACTIVE' ? data.member.detail.Data().__raw : null,
      MemberActiveInternal: data.member.detail.type === 'ACTIVE' && data.member.detail.activeType === 'INTERNAL' ? data.member.detail.ActiveData().__raw : null,
      MemberActiveExternal: data.member.detail.type === 'ACTIVE' && data.member.detail.activeType === 'EXTERNAL' ? data.member.detail.ActiveData().__raw : null,
      MemberAlumni: data.member.detail.type === 'ALUMNI' ? data.member.detail.Data().__raw : null,
    }),
  },
})) satisfies ModelSerializer<ThisModel>;

/// Utils ///

const separateRD = separateRawData<ThisModel, IncludeKey>(includeKeys);
const dbError = DatabaseError.createWith(metadata);

function processRawRelated(res: Prisma.MemberGetPayload<RelatedResponseClearerInclude<ArrayElem<typeof includeKeysRelated>>>) {
  const { MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni, ...Member } = res;
  if (MemberStatus == null) throw new Error('不正なデータ: `MemberStatus` が取得できませんでした');
  if (MemberSensitive == null) throw new Error('不正なデータ: `MemberSensitive` が取得できませんでした');
  return { Member, MemberStatus, MemberSensitive, MemberActive, MemberActiveInternal, MemberActiveExternal, MemberAlumni };
}
export class $MemberBase<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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
      __build: (args: RawData) => new $MemberBase(client, args, builder),

      from: (memberId: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.memberBase.findUniqueOrThrow({ where: { memberId } }),
        ).map(separateRD.default);

        return ok(new $MemberBase(client, rawData, builder));
      }).mapErr(dbError('from')),

      fromWithResolved: (memberId: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const [__raw, __rawResolved] = yield * await ResultAsync.combine([
          databaseWrapBridgeResult(
            client.memberBase.findUniqueOrThrow({ where: { memberId }, include: includeKeys2select(includeKeys) }),
          ),
          databaseWrapBridgeResult(
            client.member.findUniqueOrThrow({ where: { id: memberId }, include: includeKeys2select(includeKeysRelated) }),
          ).map(processRawRelated),
        ]);
        const rawData: RawData = { __raw, __rawResolved };

        return ok(new $MemberBase<'WITH_RESOLVED'>(client, rawData, builder));
      }).mapErr(dbError('fromWithResolved')),

      findMany: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.memberBase.findMany(args),
        ).map((ms) => ms.map(separateRD.default));

        return ok(rawData.map((data) => new $MemberBase(client, data, builder)));
      }).mapErr(dbError('fetchMany')),

      /// WARN: expensive!!!  order: O(2n)
      findManyWithResolved: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const [__raw, __rawResolved] = yield * await ResultAsync.combine([
          databaseWrapBridgeResult(
            client.memberBase.findMany({
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

        return ok(rawData.map((data) => new $MemberBase<'WITH_RESOLVED'>(client, data, builder)));
      }).mapErr(dbError('findManyWithResolved')),

    } as const satisfies ModelBuilder<ThisModel>);
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $MemberBase.with(this.client)(this.builder).fromWithResolved(this.data.memberId),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    const __raw = this.serialized.schema.toRaw({ ...this.data, ...data });
    return databaseWrapBridgeResult(
      this.client.memberBase.update({ data: __raw, where: { memberId: this.data.memberId } }),
    )
      .mapErr(dbError('update'))
      .map(separateRD.default)
      .map((r) => new $MemberBase(this.client, r, this.builder));
  }

  public delete(): DatabaseResult<void> {
    return databaseWrapBridgeResult(
      this.client.memberBase.delete({ where: { memberId: this.data.memberId } }),
    )
      .mapErr(dbError('delete'))
      .map(() => undefined);
  }
}
