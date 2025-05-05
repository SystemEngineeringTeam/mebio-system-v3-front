import type { Model, ModelBuilder, ModelBuilderType, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build, ModelSerializer } from '@/types/model';
import type { Brand, Override } from '@/types/utils';
import type { DatabaseResult } from '@/utils/errors/database';
import type {
  PrismaClient,
  Snapshot as SchemaRaw,
} from '@prisma/client';
import { parseUuid } from '@/utils';
import { DatabaseError, databaseWrapBridgeResult } from '@/utils/errors/database';
import { ModelOperationError } from '@/utils/errors/database/model-operation';
import { schemaRaw2rawData } from '@/utils/model';
import { err, ok, safeTry } from 'neverthrow';

/// Metadata ///

const metadata = {
  displayName: 'スナップショット',
  modelName: 'snapshot',
  primaryKeyName: 'id',
} as const satisfies ModelMetadata<'snapshot'>;

/// Custom Types ///

export type SnapshotId = Brand<'snapshotId', string>;
export const SnapshotId = {
  from: parseUuid<'snapshotId'>,
};

/// Model Types ///

type Schema = Override<
  SchemaRaw,
  {
    id: SnapshotId;
    body: JSON;
  }
>;

interface SchemaResolvedRaw {
}

interface SchemaResolved {
}

/// ModelTypes ///

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModelImpl<M extends ModelMode = 'DEFAULT'> = Model<M, ModelGen>;
type ThisModel<M extends ModelMode = 'DEFAULT'> = $Snapshot<M>;
interface ThisModelVariants {
  DEFAULT: ThisModel;
  WITH_RESOLVED: ThisModel<'WITH_RESOLVED'>;
}
type RawData = ModelRawData4build<ThisModel>;

/// Serializer ///

const serializer = ((_, __) => ({
  schema: {
    fromRaw: (__raw) => ({
      ...__raw,
      id: SnapshotId.from(__raw.id)._unsafeUnwrap(),
      body: JSON.parse(__raw.body),
    }),
    toRaw: (data) => ({
      ...data,
      body: JSON.stringify(data.body),
    }),
  },
  schemaResolved: undefined,
})) satisfies ModelSerializer<ThisModel>;

/// Utils ///

const dbError = DatabaseError.createWith(metadata);

/// Model ///

export class $Snapshot<Mode extends ModelMode = 'DEFAULT'> implements ThisModelImpl<Mode> {
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

  public static with(client: PrismaClient) {
    return (builder: ModelBuilderType) => ({
      __build: (args: RawData) => new $Snapshot(client, args, builder),

      from: (id: SnapshotId) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.snapshot.findUniqueOrThrow({ where: { id } }),
        ).map(schemaRaw2rawData<ThisModel>);

        return ok(new $Snapshot(client, rawData, builder));
      }).mapErr(dbError('from')),

      findMany: (args) => safeTry(async function* () {
        if (builder.type === 'ANONYMOUS') {
          return err(ModelOperationError.create({ type: 'PERMISSION_DENIED', context: { builder } }));
        }

        const rawData = yield * await databaseWrapBridgeResult(
          client.snapshot.findMany(args),
        ).map((ms) => ms.map(schemaRaw2rawData<ThisModel>));

        return ok(rawData.map((data) => new $Snapshot(client, data, builder)));
      }).mapErr(dbError('fetchMany')),
    } as const satisfies ModelBuilder<ThisModel>);
  }

  public update(data: Partial<Schema>): DatabaseResult<ThisModel> {
    const __raw = this.serialized.schema.toRaw({ ...this.data, ...data });
    return databaseWrapBridgeResult(
      this.client.snapshot.update({
        data: __raw,
        where: { id: this.data.id },
      }),
    )
      .mapErr(dbError('update'))
      .map(schemaRaw2rawData<ThisModel>)
      .map((r) => new $Snapshot(this.client, r, this.builder));
  }

  public delete(): DatabaseResult<void> {
    return databaseWrapBridgeResult(
      this.client.snapshot.delete({ where: { id: this.data.id } }),
    )
      .mapErr(dbError('delete'))
      .map(() => undefined);
  }
}
