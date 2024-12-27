import type { GRADES, POSITIONS } from '@/consts/member';
import type { zActiveMember, zAlumniMember, zExternalMember, zInsertMember, zMember, zMemberBaseInfo, zMemberBasePrivateInfo, zMemberPrivateInfo, zMemberPublicInfo, zMemberStatus, zUpdateMember } from '@/schema/member';
import type { z } from 'zod';

export type Grade = typeof GRADES[number];
export type Position = typeof POSITIONS[number] | null;
export type Gender = 'male' | 'female' | 'other';

export type MemberStatus = z.infer<typeof zMemberStatus>;
export type MemberBaseInfo = z.infer<typeof zMemberBaseInfo>;
export type MemberBasePrivateInfo = z.infer<typeof zMemberBasePrivateInfo>;

export type ActiveMember = z.infer<typeof zActiveMember>;
export type AlumniMember = z.infer<typeof zAlumniMember>;
export type ExternalMember = z.infer<typeof zExternalMember>;

export type MemberPublicInfo = z.infer<typeof zMemberPublicInfo>;
export type MemberPrivateInfo = z.infer<typeof zMemberPrivateInfo>;
export type Member = z.infer<typeof zMember>;

export type InsertMember = z.infer<typeof zInsertMember>;
export type UpdateMember = z.infer<typeof zUpdateMember>;
