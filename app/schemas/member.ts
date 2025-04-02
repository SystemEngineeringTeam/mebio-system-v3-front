import { z } from 'zod';

const zMember = z.strictObject({
  subject: z.string(),
  email: z.string().email('メールアドレスは不正です'),
});

const zMemberBase = z.strictObject({
  iconUrl: z.string({ required_error: 'アイコンのURLは必須です' }).url('アイコンのURLは不正です'),
  firstName: z.string({ required_error: '名前(名)は必須です' }),
  lastName: z.string({ required_error: '名前(姓)は必須です' }),
  firstNameKana: z.string({ required_error: 'フリガナ(名)は必須です' }).regex(/^[\u30A1-\u30F6]+$/, 'フリガナ(名)はカタカナで入力してください'),
  lastNameKana: z.string({ required_error: 'フリガナ(姓)は必須です' }).regex(/^[\u30A1-\u30F6]+$/, 'フリガナ(名)はカタカナで入力してください'),
});

const zMemberStatus = z.strictObject({
  lastRenewalDate: z.date({ required_error: '電話番号は必須です' }).default(() => new Date()),
  // updatedHasDeletedById
  // updatedLastRenewalDateById
});

const zGender = z.enum(['男性', '女性', 'その他'], { required_error: '性別は必須です' }).transform((g) => {
  switch (g) {
    case '男性':
      return 'male';
    case '女性':
      return 'female';
    case 'その他':
      return 'other';
  }
});

const zMemberSensitive = z.strictObject({
  birthday: z.date({ required_error: '誕生日は必須です' }),
  gender: zGender,
  phoneNumber: z.string({ required_error: '電話番号は必須です' }).regex(/^\d\{\}$/, '電話番号はハイフンありで入れてください'),
  currentZipCode: z.string({ required_error: '現在の郵便番号は必須です' }).regex(/^\d{3}-\d{4}$/, '郵便番号はハイフンありで入れてください'),
  currentAddress: z.string({ required_error: '現在の住所は必須です' }),
  parentsZipCode: z.string({ required_error: '実家の郵便番号は必須です' }).regex(/^\d{3}-\d{4}$/, '郵便番号はハイフンありで入れてください'),
  parentsAddress: z.string({ required_error: '実家の住所は必須です' }),
});

const zGrade = z.enum(['B1 ', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2']);

const zMemberActive = z.strictObject({
  grade: zGrade,
});

const zMemberActiveInternal = z.strictObject({
  studentId: z.string({ required_error: '学籍番号は必須です' }).regex(/^[a-z]\d{5}$/, '学籍番号は 英小文字+数字5桁で入れてください'),
  role: z.enum(['会長', '副会長', '会計', '広報', '事務', '総務', '会計補佐', '広報補佐', '事務補佐', '総務補佐']).optional(),
});

const zMemberActiveExternal = z.strictObject({
  schoolName: z.string({ required_error: '学校名は必須です' }),
  schoolMajor: z.string({ required_error: '学科名/専攻名は必須です' }),
  organization: z.string({ required_error: '団体名は必須です' }),
});

const zMemberAlumni = z.strictObject({
  graduatedYear: z.number({ required_error: '卒業年度は必須です' }).int('卒業年度は整数で入れてください').min(1900, '卒業年度は2000年以降で入れてください'),
  oldRole: z.string().optional(),
});

// 現役内部生
const zMemberInternalActive = zMemberActive.merge(zMemberActiveInternal).merge(z.strictObject({
  type: z.literal('INTERNAL_ACTIVE', { required_error: '会員種別は必須です' }),
}));

// 現役外部生
const zMemberExternalActive = zMemberActive.merge(zMemberActiveExternal).merge(z.strictObject({
  type: z.literal('EXTERNAL_ACTIVE', { required_error: '会員種別は必須です' }),
}));

// 内部卒業生
const zMemberInternalAlumni = zMemberInternalActive.omit({ type: true }).merge(zMemberAlumni).merge(z.strictObject({
  type: z.literal('INTERNAL_ALUMNI', { required_error: '会員種別は必須です' }),
}));

// 外部卒業生
const zMemberExternalAlumni = zMemberExternalActive.omit({ type: true }).merge(zMemberAlumni).merge(z.strictObject({
  type: z.literal('EXTERNAL_ALUMNI', { required_error: '会員種別は必須です' }),
}));

export const zMemberCreate = zMember.merge(zMemberBase).merge(zMemberStatus).merge(zMemberSensitive).and(
  z.union([
    zMemberInternalActive,
    zMemberExternalActive,
    zMemberInternalAlumni,
    zMemberExternalAlumni,
  ]),
);

export type MemberCreate = z.infer<typeof zMemberCreate>;
