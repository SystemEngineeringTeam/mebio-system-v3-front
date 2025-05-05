import type { ModelBuilderType } from '@/types/model';
import type { DatabaseErrorEntryImpl } from '@/utils/errors/database';
import { match } from 'ts-pattern';

export interface ModelOperationError {
  type: 'MODEL_OPERATION_ERROR';
  detail:
    | {
      type: 'PERMISSION_DENIED';
      context: {
        builder: ModelBuilderType;
      };
    }
    | {
      type: 'UNKNOWN_ERROR';
    };
}

export const ModelOperationError = {
  type: 'MODEL_OPERATION_ERROR',

  create(detail) {
    return ({ type: this.type, detail } as const satisfies ModelOperationError);
  },

  getInfo: (metadata) => (self) => match(self.detail)
    .with({ type: 'PERMISSION_DENIED' }, () => ({
      message: `この${metadata.displayName}は許可されていません`,
      hint: undefined,
    }))
    .with({ type: 'UNKNOWN_ERROR' }, () => ({
      message: `この${metadata.displayName}は不明なエラーが発生しました`,
      hint: undefined,
    }))
    .exhaustive(),

  toStatusCode: (self) => match(self.detail.type)
    .with('PERMISSION_DENIED', () => 403)
    .with('UNKNOWN_ERROR', () => 500)
    .exhaustive(),

  toExposed: (self) => {
    const { type, detail: { type: _type } } = self;
    return { type, detail: { type: _type } };
  },

} as const satisfies DatabaseErrorEntryImpl<ModelOperationError>;
