import type { AuthUser } from '@/services/auth.server';
import type { Member } from '@/services/member.server';
import { createContext } from 'react';

export interface AuthUserContext {
  user: AuthUser;
  member: Member;
}
export const authUserContext = createContext<AuthUserContext | undefined>(undefined);

export default authUserContext;
