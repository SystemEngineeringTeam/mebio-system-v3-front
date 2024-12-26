import type { AuthUser } from '@/services/auth.server';
import type { MemberStatus } from '@/types/member';
import { createContext } from 'react';

export const authUserContext = createContext<AuthUser & MemberStatus | null>(null);

export default authUserContext;
