import type { $Member } from '@/models/member';
import type { DatabaseResult } from '@/types/database';
import type { BuildModelResult, ModelEntityOf, ModelGenerator, ModelMetadata, ModelMode, ModelRawData4build } from '@/types/model';
import type { Brand, Override } from '@/types/utils';
import type { PrismaClient, Snapshot as SchemaRaw } from '@prisma/client';
import { Database } from '@/services/database.server';
import { parseUuid } from '@/utils';
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

type RawData = ModelRawData4build<SchemaRaw, SchemaResolvedRaw>;

/// Model ///

export const __Snapshot = (<M extends ModelMode = 'DEFAULT'>(client: PrismaClient) => class Snapshot<_Mode extends ModelMode = M> {
  public static __prisma = client;

  private dbError = Database.dbErrorWith(metadata);

  public __raw: SchemaRaw;
  public data: Schema;
  public __rawResolved: undefined;
  public dataResolved: undefined;

  private constructor({ __raw }: RawData, private builder?: ModelEntityOf<$Member>) {
    this.__raw = __raw;
    this.data = {
      ...__raw,
      id: SnapshotId.from(__raw.id)._unsafeUnwrap(),
      body: JSON.parse(__raw.body),
    };
  }

  public static __build(rawData: RawData, builder?: ModelEntityOf<$Member>): BuildModelResult<Snapshot<'DEFAULT'>> {
    const isSelf = builder == null;
    if (isSelf) {
      return ok(new Snapshot(rawData));
    }

    // TODO: 権限を戦わせるロジックを `Member` 配下に外部化する
    if (builder.data.securityRole !== 'OWNER') {
      return err({ type: 'PERMISSION_DENIED', detail: { builder } } as const);
    }

    return ok(new Snapshot(rawData, builder));
  }

  public static from(id: SnapshotId, builder: ModelEntityOf<$Member>): DatabaseResult<BuildModelResult<Snapshot<'DEFAULT'>>> {
    return Database.transformResult(
      client.snapshot.findUniqueOrThrow({
        where: { id },
      }),
    )
      .mapErr(Database.dbErrorWith(metadata).transform('from'))
      .map((__raw) => Snapshot.__build({ __raw }, builder));
  }

  public update(_operator: ModelEntityOf<$Member>, _data: Partial<Schema>): DatabaseResult<Snapshot> {
    throw new Error('Method not implemented.');
  }

  public delete(_operator: ModelEntityOf<$Member>): DatabaseResult<void> {
    throw new Error('Method not implemented.');
  }
}) satisfies ModelGenerator<any, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>;

export type $Snapshot<M extends ModelMode = 'DEFAULT'> = ModelGenerator<M, typeof metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved> & typeof __Snapshot<M>;
