import type { ModelBuilderType, ModelMetadata } from '@/types/model';
import type { Nullable } from '@/types/utils';
import type { Prisma } from '@prisma/client';
import type { ResultAsync } from 'neverthrow';

export const clientKnownErrorCode = {
  ALREADY_EXISTS: 'P2002',
  NO_ROWS_FOUND: 'P2025',
} as const satisfies Record<string, string>;

// ref: https://www.prisma.io/docs/orm/reference/error-reference
export type PrismaClientError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientRustPanicError
  | Prisma.PrismaClientInitializationError
  | Error;

export type PrismaBridgeErrorDetail =
  | {
    type: keyof typeof clientKnownErrorCode | 'UNKNOWN_REQUEST_ERROR';
    _raw: Prisma.PrismaClientKnownRequestError;
  }
  | {
    type: 'DATA_VALIDATION_FAILED';
    _raw: Prisma.PrismaClientValidationError;
  }
  | {
    type: 'UNKNOWN_REQUEST_ERROR';
    _raw: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError;
  }
  | {
    type: 'UNKNOWN_ERROR';
    _raw: Prisma.PrismaClientRustPanicError | Prisma.PrismaClientInitializationError;
  }
  | {
    type: 'UNEXPECTED_ERROR';
    _raw: Error;
  };

export type ModelBuildErrorDetail =
  | {
    type: 'PERMISSION_DENIED';
    detail: {
      builder: ModelBuilderType;
    };
  }
  | {
    type: 'UNKNOWN_ERROR';
  };

export interface DatabaseError {
  metadata: ModelMetadata<any>;
  caller: string;
  message: string;
  hint: Nullable<string>;
  error:
    | {
      type: 'PRISMA_BRIDGE_ERROR';
      detail: PrismaBridgeErrorDetail;
    }
    | {
      type: 'MODEL_BUILD_ERROR';
      detail: ModelBuildErrorDetail;
    };
}

export type DatabaseErrorWith<T extends DatabaseError['error']['type'] = DatabaseError['error']['type']>
  = DatabaseError & { error: Extract<DatabaseError['error'], { type: T }> };
export type DatabaseResult<S, E = DatabaseError> = ResultAsync<S, E>;
