import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, Model, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build } from '@/types/model';
import type { Brand, Override } from '@/types/utils';
import type { PrismaClient, Snapshot as SchemaRaw } from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';
import { isSelf } from '@/utils/model';
import { err, ok } from 'neverthrow';

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

type ModelGen = ModelGenerator<typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;
type ThisModel<Mode extends ModelMode = 'DEFAULT'> = Model<Mode, ModelGen>;
type RawData = ModelRawData4build<ThisModel>;

/// Model ///

export const __Snapshot = (<Mode extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Snapshot implements ThisModel<Mode> {
  public static __prisma = client;

  private dbError = Database.dbErrorWith(metadata);

  public __raw: SchemaRaw;
  public data: Schema;

  private constructor({ __raw }: RawData, private builder?: ModelEntityOf<$Member>) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      id: SnapshotId.from(__raw.id)._unsafeUnwrap(),
      body: JSON.parse(__raw.body),
    };
  }

  public static __build(rawData: { __raw: SchemaRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'DEFAULT'>>;
  public static __build(rawData: { __raw: SchemaRaw; __rawResolved: SchemaResolvedRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<'WITH_RESOLVED'>>;
  public static __build<M extends ModelMode>(rawData: { __raw: SchemaRaw; __rawResolved?: SchemaResolvedRaw }, builder?: ModelEntityOf<$Member>): BuildModelResult<ThisModel<M>> {
    const Model = __Snapshot<M>(client);
    if (isSelf(builder)) {
      return ok(new Model(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new Model(rawData, builder));
  }

  public static from(id: SnapshotId) {
    return Database.transformResult(
      client.snapshot.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => ({
        buildBy: (builder: ModelEntityOf<$Member>) => Snapshot.__build({ __raw }, builder),
        buildBySelf: () => Snapshot.__build({ __raw }),
      }));
  }

  public update(_data: Partial<Schema>): DatabaseResult<ThisModel> {
    throw new Error('Method not implemented.');
  }

  public delete(): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGen;

export type $Snapshot<M extends ModelMode = 'DEFAULT'> = ModelGen & typeof __Snapshot<M>;
