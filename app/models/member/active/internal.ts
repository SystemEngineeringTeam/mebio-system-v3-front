import type { $Member } from '@/models/member';
import type { Model, ModelBuilder, ModelBuilderType, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelResolver, ModelSchemaRawOf, ModelSerializer, ModeWithResolved } from '@/types/model';
import type { ArrayElem, Override } from '@/types/utils';
import type { DatabaseResult } from '@/utils/errors/database';
import type {
  Prisma,
  PrismaClient,
  MemberActiveInternal as SchemaRaw,
} from '@prisma/client';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { DatabaseError, databaseWrapBridgeResult } from '@/utils/errors/database';
import { ModelOperationError } from '@/utils/errors/database/model-operation';
import { includeKeys2select, matchWithDefault, matchWithResolved, schemaRaw2rawData, separateRawData } from '@/utils/model';
import { err, ok, safeTry } from 'neverthrow';
import { z } from 'zod';

/// Metadata ///

const metadata = {
  displayName: '現役生 (内部) の情報',
  modelName: 'memberActiveInternal',
  primaryKeyName: 'memberId',
} as const satisfies ModelMetadata<'memberActiveInternal'>;

/// Custom Types ///

const ROLE = ['CHAIRPERSON', 'VICE_CHAIRPERSON', 'TREASURER', 'GENERAL_AFFAIRS', 'PUBLIC_RELATIONS', 'SECRETARY', 'TREASURER_ASSISTANT', 'GENERAL_AFFAIRS_ASSISTANT', 'PUBLIC_RELATIONS_ASSISTANT', 'SECRETARY_ASSISTANT'] as const;
const zRole = z.enum(ROLE);
type Role = ArrayElem<typeof ROLE>;

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    memberId: MemberId;
    role: Role;
  }
>;

type IncludeKey = keyof Prisma.MemberActiveInternalInclude;
const includeKeys = ['Member'] as const satisfies IncludeKey[];

interface SchemaResolvedRaw {
  Member: ModelSchemaRawOf<$Member>;
}

interface SchemaResolved {
  _parent: {
    Member: () => $Member;
  };
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $MemberActiveInternal<M>;
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
      role: zRole.parse(__raw.role),
    }),
    toRaw: (data) => ({ ...data }),
  },
  schemaResolved: {
    fromRaw: (__rawResolved) => {
      const { models } = new Database(client);
      const { Member } = __rawResolved;

      return {
        _parent: {
          Member: () => models.Member(builder).__build(schemaRaw2rawData<$Member>(Member)),
        },
      };
    },
    toRaw: (data) => ({
      Member: data._parent.Member().__raw,
    }),
  },
})) satisfies ModelSerializer<ThisModel>;

/// Utils ///

const separateRD = separateRawData<ThisModel, IncludeKey>(includeKeys);
const dbError = DatabaseError.createWith(metadata);

/// Model ///

export class $MemberActiveInternal<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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
      __build: (args: RawData) => new $MemberActiveInternal(client, args, builder),

      from: (memberId: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.memberActiveInternal.findUniqueOrThrow({ where: { memberId } }),
        ).map(separateRD.default);

        return ok(new $MemberActiveInternal(client, rawData, builder));
      }).mapErr(dbError('from')),

      fromWithResolved: (memberId: MemberId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.memberActiveInternal.findUniqueOrThrow({ where: { memberId }, include: includeKeys2select(includeKeys) }),
        ).map(separateRD.withResolved);

        return ok(new $MemberActiveInternal<'WITH_RESOLVED'>(client, rawData, builder));
      }).mapErr(dbError('fromWithResolved')),

      findMany: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.memberActiveInternal.findMany(args),
        ).map((ms) => ms.map(separateRD.default));

        return ok(rawData.map((data) => new $MemberActiveInternal(client, data, builder)));
      }).mapErr(dbError('fetchMany')),
    } as const satisfies ModelBuilder<ThisModel>);
  }

  public resolveRelation(): ModelResolver<Mode, ThisModel> {
    return matchWithDefault(
      this.__rawResolved,
      () => $MemberActiveInternal.with(this.client)(this.builder).fromWithResolved(this.data.memberId),
    );
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    const __raw = this.serialized.schema.toRaw({ ...this.data, ...data });
    return databaseWrapBridgeResult(
      this.client.memberActiveInternal.update({ data: __raw, where: { memberId: this.data.memberId } }),
    )
      .mapErr(dbError('update'))
      .map(separateRD.default)
      .map((r) => new $MemberActiveInternal(this.client, r, this.builder));
  }

  public delete(): DatabaseResult<void> {
    return databaseWrapBridgeResult(
      this.client.memberActiveInternal.delete({ where: { memberId: this.data.memberId } }),
    )
      .mapErr(dbError('delete'))
      .map(() => undefined);
  }
}
