import type { $Member } from '@/models/member';
import type { $MemberBase } from '@/models/member/base';
import type { $MemberStatus } from '@/models/member/status';
import type { ModelSchemaOf } from '@/types/model';
import { createContext } from 'react';

export interface MemberContextType {
  auth: ModelSchemaOf<$Member>;
  base: ModelSchemaOf<$MemberBase>;
  status: ModelSchemaOf<$MemberStatus>;
}

export const memberContext = createContext<MemberContextType | undefined>(undefined);

export default memberContext;
