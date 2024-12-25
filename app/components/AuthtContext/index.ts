import type { AuthUser } from '@/utils/auth.server';
import { createContext } from 'react';

export const authUserContext = createContext<AuthUser | null>(null);

export default authUserContext;
