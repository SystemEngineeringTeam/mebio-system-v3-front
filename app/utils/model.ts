import type { DatabaseResult } from '@/types/database';
import type {
  AnyModel,
  ModelMetadata,
  ModelMetadataOf,
  ModelSchemaOf,
  ModelSchemaRawOf,
} from '@/types/model';
import type { Prisma, PrismaClient } from '@prisma/client';
import { Database } from '@/services/database.server';

export abstract class Model<
  Metadata extends ModelMetadata<any, 'CATCH_ALL'>,
  SchemaRaw extends object,
  Schema extends object = SchemaRaw,
  SchemaResolved extends Schema = any,
> {
  public constructor(
    protected metadata: Metadata,
    public __raw: SchemaRaw,
  ) { }

  public abstract data: Schema;

  // public resolveRelation?(): DatabaseResult<SchemaRelation>;
  // public resolveReferenced?(): DatabaseResult<SchemaReferenced>;

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
    M extends AnyModel,
  >(
    client: PrismaClient,
  ) {
    return (
      Model: new (__raw: any) => M,
      metadata: ModelMetadataOf<M>,
    ) => ({
      from<
        N extends Uncapitalize<Prisma.ModelName> = ModelMetadataOf<M>['modelName'],
        F extends ModelMetadataOf<M>['primaryKeyName'] = keyof PrismaClient[N]['fields'],
      >(
        searchId: M extends AnyModel ? ModelSchemaOf<M>[F] : never,
        ...args: M extends AnyModel
          ? Parameters<PrismaClient[N]['findFirstOrThrow']>
          : never
      ): DatabaseResult<M> {
        const modelName = metadata.modelName as N;
        const result = Database.transformResult<ModelSchemaRawOf<M>>(
          // @ts-expect-error: `findUniqueOrThrow` の引数が解決しない……
          // eslint-disable-next-line ts/no-unsafe-argument
          client[modelName].findFirstOrThrow({
            ...args,
            where: { [metadata.primaryKeyName]: searchId },
          }),
        );

        return result
          .map((data) => new Model(data))
          .mapErr((e) => Database.transformError(metadata, 'from', e));
      },
    });
  }
}
