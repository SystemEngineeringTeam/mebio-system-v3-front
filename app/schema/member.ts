import { GRADES, POSITIONS } from '@/consts/member';
import { z } from 'zod';

export const zGender = z.enum(['male', 'female', 'other']);
export const zPosition = z.enum(POSITIONS).nullable();

const zKana = z.string().regex(/A[ァ-ヴー]+z/u, { message: '全角カタカナで入力してください' });
const zZipCode = z.string().regex(/^\d{3}-\d{4}$/, { message: 'xxx-xxxx形式で入力してください' });
const zExpectedGraduationYear = z.number().min(new Date().getFullYear(), { message: '今年以降の年度で入力してください' }).max(new Date().getFullYear() + 10, { message: '10年以内の年度で入力してください' });

// 部員のステータス
export const zMemberStatus = z.object({
  isAdmin: z.boolean(),
  status: z.enum(['temporary', 'approved', 'registered']),
}).strict();

// 共通
export const zMemberBaseInfo = z.object({
  uuid: z.string().uuid({ message: 'uuid形式で入力してください' }),
  iconUrl: z.string().url({ message: 'URL形式で入力してください' }),
  firstName: z.string(),
  lastName: z.string(),
  firstNameKana: zKana,
  lastNameKana: zKana,
  slackDisplayName: z.string(),
}).strict();

// 部員の非公開情報
export const zMemberBasePrivateInfo = z.object({
  gender: zGender,
  birthday: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, { message: 'yyyy-mm-dd形式で入力してください' }),
  phoneNumber: z.string().regex(/^\d{3,4}-\d{3,4}-\d{3,4}$/, { message: 'xxx-xxxx-xxxx形式で入力してください' }),
  email: z.string().email({ message: 'メールアドレス形式で入力してください' }),
  currentAddress: z.string(),
  currentAddressZipCode: zZipCode,
  parentAddress: z.string(),
  parentAddressZipCode: zZipCode,
}).strict();

// 現役生の公開情報
export const zActiveMember = zMemberBaseInfo.extend({
  type: z.literal('active'),
  studentId: z.string().regex(/^[evcbmpdsalthkx]2\d{4}$/, { message: '英小文字+4桁の形式で入力してください' }),
  position: zPosition,
  grade: z.enum(GRADES),
  expectedGraduationYear: zExpectedGraduationYear,
}).strict();

// 卒業生の公開情報
export const zAlumniMember = zMemberBaseInfo.extend({
  type: z.literal('alumni'),
  oldPosition: zPosition.or(z.string()),
  graduationYear: z.number().min(1900, { message: '1900年以降で入力してください' }).max(new Date().getFullYear(), { message: '今年以前で入力してください' }),
}).strict();

// 外部生の公開情報
export const zExternalMember = zMemberBaseInfo.extend({
  type: z.literal('external'),
  schoolName: z.string(),
  organization: z.string(),
  expectedGraduationYear: zExpectedGraduationYear,
}).strict();

// 部員の公開情報
export const zMemberPublicInfo = z.object({
  public: zActiveMember.or(zAlumniMember).or(zExternalMember),
}).strict();

// 部員の非公開情報
export const zMemberPrivateInfo = z.object({
  private: zMemberBasePrivateInfo,
}).strict();

// 部員の全情報
export const zMember = zMemberStatus.merge(zMemberPublicInfo).merge(zMemberPrivateInfo).strict();

// 新規登録時
export const zInsertMember = z.object({
  public: z.union([
    zActiveMember.omit({ uuid: true, position: true }),
    zAlumniMember.omit({ uuid: true }),
    zExternalMember.omit({ uuid: true }),
  ]),
  private: zMemberBasePrivateInfo,
}).strict();

// 編集時
export const zUpdateMember = z.object({
  public: z.union([
    zActiveMember.omit({ uuid: true, position: true }),
    zAlumniMember.omit({ uuid: true }),
    zExternalMember.omit({ uuid: true }),
  ]),
  private: zMemberBasePrivateInfo,
}).strict();
