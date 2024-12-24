import type { AuthUser } from '@/utils/auth.server';
import { createContext } from 'react';

export const authContext = createContext<AuthUser>({
  id: '',
  name: '',
  email: '',
});

export default authContext;
