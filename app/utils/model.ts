import type { DatabaseResult } from '@/types/database';
import type {
  AnyModel,
  ModelMetadata,
  ModelMetadataOf,
  ModelSchemaOf,
} from '@/types/model';
import type { Brand } from '@/types/utils';
import type { Prisma, PrismaClient } from '@prisma/client';
import { Database } from '@/services/database.server';
import { toUncapitalize } from '@/utils';

export abstract class Model<
  Metadata extends ModelMetadata<any, 'CATCH_ALL'>,
  Schema extends object,
> {
  public constructor(public data: Schema, protected metadata: Metadata) {}

  /**
   * {@link Database.transformError} の部分適用.
   * `Model` を継承しているので, 最初の引数を省略できる.
   */
  protected transformError(caller: string) {
    return (
      ...rest: Parameters<typeof Database.transformError> extends [
        any,
        any,
        ...infer R,
      ]
        ? R
        : never
    ) => Database.transformError(this.metadata, caller, ...rest);
  }

  protected transformResult = Database.transformResult;

  protected static getFactories<
    B extends Brand<string, unknown>,
    M extends AnyModel,
  >(
    client: PrismaClient,
  ) {
    return (
      Model: new (data: ModelSchemaOf<M>) => M,
      metadata: ModelMetadataOf<M>,
    ) => ({
      from: (id: B): DatabaseResult<M> => {
        const { modelName, primaryKeyName } = metadata as ModelMetadata<Prisma.ModelName, 'CATCH_ALL'>;
        const modelNameUnCapitalize = toUncapitalize (modelName);

        const result = Database.transformResult<ModelSchemaOf<M>>(
          // @ts-expect-error: `primaryKeyName` が `any` になってしまうため, 型エラーが発生する
          // eslint-disable-next-line ts/no-unsafe-argument
          client[modelNameUnCapitalize].findUniqueOrThrow({ where: { [primaryKeyName]: id } }),
        );

        return result
          .map((data) => new Model(data))
          .mapErr((e) => Database.transformError(metadata, 'from', e));
      },
    });
  }
}
