import { TYPES } from '@/consts/member';

export function toTypeName(key: string) {
  const type = TYPES.find((t) => t.key === key);
  return type?.name;
}
