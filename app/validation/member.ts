import type { EditableMember, Member } from '@/types/member';
import typia from 'typia';

export const validateMember = typia.createValidate<Member>();
export const validateEditableMember = typia.createValidate<EditableMember>();
