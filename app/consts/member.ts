export const STATUS = [
  { key: 'temporary', name: '仮登録' },
  { key: 'approved', name: '承認済' },
  { key: 'registered', name: '登録済' },
] as const;
export const TYPES = [
  { key: 'active', name: '現役生' },
  { key: 'alumni', name: '卒業生' },
  { key: 'external', name: '外部生' },
] as const;
export const GRADES = ['B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2', 'D3'] as const;
export const POSITIONS = ['会長', '副会長', '会計', '総務', '広報', '事務', '会計補佐', '総務補佐', '広報補佐', '事務補佐',
] as const;
export const GENDERS = [
  { key: 'male', name: '男性' },
  { key: 'female', name: '女性' },
  { key: 'other', name: 'その他' },
] as const;
