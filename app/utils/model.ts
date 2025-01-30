import type { ModelGenerator, ModelMetadata, ModeWithResolved } from '@/types/model';
import type { Nullable } from '@/types/utils';

export function createModel<
  Metadata extends ModelMetadata<any, 'CATCH_ALL'> = any,
  SchemaRaw extends object = any,
  Schema extends object = SchemaRaw,
  SchemaResolvedRaw extends object = any,
  SchemaResolved extends object = SchemaResolvedRaw,
>(
  generator: ModelGenerator<Metadata, SchemaRaw, Schema, SchemaResolvedRaw, SchemaResolved>,
) {
  return generator;
}

export function includeKeys2select<IncludeKey extends string>(includeKeys: IncludeKey[]): Record<IncludeKey, true> {
  return Object.fromEntries(includeKeys.map((key) => [key, true])) as Record<IncludeKey, true>;
}

export function matchWithResolved<Mode extends 'DEFAULT' | 'WITH_RESOLVED', R, D>(
  __rawResolved: Nullable<R>,
  transform: (resolved: R) => D,
) {
  if (__rawResolved != null) {
    return {
      rawResolved: __rawResolved,
      dataResolved: transform(__rawResolved),
    };
  } else {
    return {
      rawResolved: null as ModeWithResolved<Mode, R>,
      dataResolved: null as ModeWithResolved<Mode, D>,
    };
  }
}
