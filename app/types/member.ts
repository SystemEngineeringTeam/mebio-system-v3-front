import type { GRADES, POSITIONS, STATUS } from '@/consts/member';

export type Grade = typeof GRADES[number];
export type Position = typeof POSITIONS[number] | null;
export type Gender = 'male' | 'female' | 'other';

export interface MemberStatus {
  isAdmin: boolean;
  status: typeof STATUS[number]['key'];
}

export interface MemberBaseInfo {
  uuid: string;
  iconUrl: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  slackDisplayName: string;
}

export interface MemberBasePrivateInfo {
  gender: Gender;
  birthday: string;
  phoneNumber: string;
  email: string;
  currentAddress: string;
  currentAddressZipCode: string;
  parentAddress: string;
  parentAddressZipCode: string;
}

// 現役生
export interface ActiveMember extends MemberBaseInfo {
  type: 'active';
  studentId: string;
  position: Position;
  grade: Grade;
  expectedGraduationYear: number;
}

// OB・OG
export interface AlumniMember extends MemberBaseInfo {
  type: 'alumni';
  oldPosition: Position;
  graduationYear: number;
}

// 外部
export interface ExternalMember extends MemberBaseInfo {
  type: 'external';
  schoolName: string;
  organization: string;
  expectedGraduationYear: number;
}

// 公開情報
export interface MemberPublicInfo {
  public: ActiveMember | AlumniMember | ExternalMember;
}

// 非公開情報
export interface MemberPrivateInfo {
  private: MemberBasePrivateInfo;
}

// 全情報
export type Member = MemberStatus & MemberPublicInfo & MemberPrivateInfo;

// 新規登録時
export interface InsertMember {
  public: Omit<ActiveMember | AlumniMember | ExternalMember, 'uuid' | 'position'>;
  private: MemberBasePrivateInfo;
}

// 編集時
export interface EditableMember {
  public: Omit<ActiveMember | AlumniMember | ExternalMember, 'uuid' | 'position'>;
  private: MemberBasePrivateInfo;
}
