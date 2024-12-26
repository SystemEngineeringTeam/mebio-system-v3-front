import type { Member } from '@/types/member';
import MemberListPage from '@/pages/MemberListPage';
import { useLoaderData } from '@remix-run/react';

export function meta() {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
}

interface LoaderData {
  members: Record<string, Array<Member['public']>>;
}

export function loader(): LoaderData {
  const members: Array<Member['public']> = [
    {
      type: 'active',
      uuid: '00000000-0000-0000-0000-000000000000',
      firstName: '智',
      lastName: '佐藤',
      firstNameKana: 'サトル',
      lastNameKana: 'サトウ',
      expectedGraduationYear: 2027,
      grade: 'B2',
      position: '会計',
      studentId: 'k20000',
      slackDisplayName: 'k23075_佐藤智',
      iconUrl: 'https://satooru.me/icon.webp',
    },
    {
      type: 'active',
      uuid: '11111111-1111-1111-1111-111111111111',
      firstName: '安堵',
      lastName: '安藤',
      firstNameKana: 'アンド',
      lastNameKana: 'アンドウ',
      expectedGraduationYear: 2029,
      grade: 'B2',
      position: null,
      studentId: 'k20001',
      slackDisplayName: 'k20001_安藤安堵',
      iconUrl: 'https://satooru.me/default/penguin.webp',
    },
    {
      type: 'active',
      uuid: '11111111-1111-1111-1111-111111111112',
      firstName: '安堵',
      lastName: '安藤',
      firstNameKana: 'アンド',
      lastNameKana: 'アンドウ',
      expectedGraduationYear: 2029,
      grade: 'B2',
      position: null,
      studentId: 'k20001',
      slackDisplayName: 'k20001_安藤安堵',
      iconUrl: 'https://satooru.me/default/penguin.webp',
    },
    {
      type: 'active',
      uuid: '11111111-1111-1111-1111-111111111113',
      firstName: '安堵',
      lastName: '安藤',
      firstNameKana: 'アンド',
      lastNameKana: 'アンドウ',
      expectedGraduationYear: 2029,
      grade: 'B2',
      position: null,
      studentId: 'k20001',
      slackDisplayName: 'k20001_安藤安堵',
      iconUrl: 'https://satooru.me/default/penguin.webp',
    },
    {
      type: 'active',
      uuid: '11111111-1111-1111-1111-111111111114',
      firstName: '安堵',
      lastName: '安藤',
      firstNameKana: 'アンド',
      lastNameKana: 'アンドウ',
      expectedGraduationYear: 2029,
      grade: 'B2',
      position: null,
      studentId: 'k20001',
      slackDisplayName: 'k20001_安藤安堵',
      iconUrl: 'https://satooru.me/default/penguin.webp',
    },
    {
      type: 'active',
      uuid: '11111111-1111-1111-1111-111111111115',
      firstName: '安堵',
      lastName: '安藤',
      firstNameKana: 'アンド',
      lastNameKana: 'アンドウ',
      expectedGraduationYear: 2029,
      grade: 'B2',
      position: null,
      studentId: 'k20001',
      slackDisplayName: 'k20001_安藤安堵',
      iconUrl: 'https://satooru.me/default/penguin.webp',
    },
    {
      type: 'active',
      uuid: '11111111-1111-1111-1111-111111111116',
      firstName: '安堵',
      lastName: '安藤',
      firstNameKana: 'アンド',
      lastNameKana: 'アンドウ',
      expectedGraduationYear: 2029,
      grade: 'B2',
      position: null,
      studentId: 'k20001',
      slackDisplayName: 'k20001_安藤安堵',
      iconUrl: 'https://satooru.me/default/penguin.webp',
    },
    {
      type: 'active',
      uuid: '11111111-1111-1111-1111-111111111117',
      firstName: '安堵',
      lastName: '安藤',
      firstNameKana: 'アンド',
      lastNameKana: 'アンドウ',
      expectedGraduationYear: 2029,
      grade: 'B2',
      position: null,
      studentId: 'k20001',
      slackDisplayName: 'k20001_安藤安堵',
      iconUrl: 'https://satooru.me/default/penguin.webp',
    },
    {
      type: 'alumni',
      uuid: '22222222-2222-2222-2222-222222222222',
      firstName: '邪馬',
      lastName: '山田',
      firstNameKana: 'ヤマ',
      lastNameKana: 'ヤマダ',
      graduationYear: 2020,
      oldPosition: '会長',
      slackDisplayName: 'k10000_山田邪馬',
      iconUrl: 'https://satooru.me/icon.webp',
    },
    {
      type: 'external',
      uuid: '22222222-2222-2222-2222-222222222222',
      firstName: '彩都',
      lastName: '斎藤',
      firstNameKana: 'サイト',
      lastNameKana: 'サイトウ',
      expectedGraduationYear: 2029,
      slackDisplayName: 'k10000_山田邪馬',
      schoolName: '愛知ペンギン大学',
      organization: 'ペンギン研究会',
      iconUrl: 'https://satooru.me/icon.webp',
    },
  ];
  const groupedMembers = Object.groupBy(members, (m) => {
    if (m.type === 'active') return m.grade;
    else return m.type;
  });
  return { members: groupedMembers };
}

export default function Index() {
  const { members } = useLoaderData<LoaderData>();

  return <MemberListPage members={members} />;
};
