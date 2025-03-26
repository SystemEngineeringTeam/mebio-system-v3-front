import type { $Member } from '@/models/member';
import type { AnyModel, ModelBuilderInternal, ModelBuilderType, ModelMode, ModelRawData4build, ModelSchemaRawOf, ModelSchemaResolvedRawOf, ModeWithDefault, ModeWithResolved } from '@/types/model';
import type { Nullable } from '@/types/utils';
import { fromEntries, getEntries } from '@/utils';
import { Prisma } from '@prisma/client';

export function includeKeys2select<IncludeKey extends string>(includeKeys: readonly IncludeKey[]): Record<IncludeKey, true> {
  return Object.fromEntries(includeKeys.map((key) => [key, true])) as Record<IncludeKey, true>;
}

export function matchWithResolved<Mode extends ModelMode, R, D>(
  __rawResolved: Nullable<R>,
  transform: (resolved: R) => D,
) {
  if (__rawResolved != null) {
    return {
      rawResolved: __rawResolved as ModeWithResolved<Mode, R>,
      dataResolved: transform(__rawResolved) as ModeWithResolved<Mode, D>,
    };
  } else {
    return {
      rawResolved: null as ModeWithResolved<Mode, R>,
      dataResolved: null as ModeWithResolved<Mode, D>,
    };
  }
}

export function matchWithDefault<Mode extends ModelMode, R, D>(
  __rawResolved: Nullable<R>,
  transform: (resolved: R) => D,
) {
  if (__rawResolved != null) {
    return transform(__rawResolved) as ModeWithDefault<Mode, D>;
  } else {
    return null as ModeWithDefault<Mode, D>;
  }
}

export function separateRawData<
  M extends AnyModel,
  IncludeKey extends string,
  SchemaRaw = ModelSchemaRawOf<M>,
  // @ts-expect-error: TypeScript の負け
  SchemaResolvedRaw extends Record<any, any> = ModelSchemaResolvedRawOf<M>,
>(includeKeys: IncludeKey[]) {
  return {
    default: (data: SchemaRaw) => ({ __raw: data, __rawResolved: undefined }),
    withResolved: (data: SchemaResolvedRaw & SchemaRaw): ModelRawData4build<M> => {
      type K = Exclude<IncludeKey, '_count'>;
      const rawKey = Object.keys(data).filter((key) => !includeKeys.includes(key as K)) as K[];
      const rawResolvedKey = Object.keys(data).filter((key) => includeKeys.includes(key as K)) as K[];

      const __raw = rawKey.reduce(
        (acc, key) => ({ ...acc, [key]: data[key] }),
        {} as SchemaRaw,
      );
      const __rawResolved = rawResolvedKey.reduce(
        (acc, key) => ({ ...acc, [key]: data[key] }),
        {} as SchemaResolvedRaw,
      );

      // @ts-expect-error: TypeScript の負け
      return { __raw, __rawResolved };
    },
  };
}

export function buildRawData<
  M extends AnyModel,
>(
  builderInternal: ModelBuilderInternal<M>,
) {
  return {
    default: (rawData: ModelRawData4build<M>) => ({
      build: (builder: ModelBuilderType) => builderInternal.__with(rawData, builder).map((m) => m.default),
      buildBy: (memberAsBuilder: $Member) => builderInternal.by(rawData, memberAsBuilder).map((m) => m.default),
      buildBySelf: () => builderInternal.bySelf(rawData).map((m) => m.default),
    }),
    withResolved: (rawData: ModelRawData4build<M>) => ({
      build: (builder: ModelBuilderType) => builderInternal.__with(rawData, builder).map((m) => m.withResolved),
      buildBy: (memberAsBuilder: $Member) => builderInternal.by(rawData, memberAsBuilder).map((m) => m.withResolved),
      buildBySelf: () => builderInternal.bySelf(rawData).map((m) => m.withResolved),
    }),
  };
}

export function schemaRaw2rawData<M extends AnyModel>(
  __raw: ModelSchemaRawOf<M>,
) {
  return {
    __raw,
    __rawResolved: undefined,
  };
}

export function fillPrismaSkip(obj: Record<string, unknown>) {
  return fromEntries(
    getEntries(obj).map(([k, v]) => {
      if (v == null) {
        return [k, Prisma.skip];
      }
      return [k, v];
    }),
  );
}
