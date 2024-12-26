import type { Member, MemberPublicInfo } from '@/types/member';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import MemberPage from '@/pages/MemberPage';
import { useLoaderData } from '@remix-run/react';

interface LoaderResult {
  member: Member | MemberPublicInfo;
}

export function loader({ params }: LoaderFunctionArgs): LoaderResult {
  // TODO: 置き換える
  if (params.uuid === undefined) {
    const member: Member = {
      public: {
        type: 'active',
        uuid: params.uuid ?? '00000000-0000-0000-0000-000000000000',
        firstName: '智',
        lastName: '佐藤',
        firstNameKana: 'サトル',
        lastNameKana: 'サトウ',
        expectedGraduationYear: 2027,
        grade: 'B2',
        position: null,
        studentId: 'k20000',
        slackDisplayName: 'k23075_佐藤智',
        iconUrl: 'https://satooru.me/icon.webp',
      },
      private: {
        email: 'satooru@example.com',
        gender: 'male',
        phoneNumber: '090-1234-5678',
        birthday: new Date('2005-01-05'),
        currentAddress: {
          zipCode: '000-0000',
          address: '愛知県名古屋市中区栄0-0-0',
        },
        parentAddress: {
          zipCode: '111-1111',
          address: '愛知県名古屋市中区栄1-1-1',
        },
      },
    };
    return { member };
  }

  const member: MemberPublicInfo = {
    public: {
      type: 'active',
      uuid: params.uuid ?? '00000000-0000-0000-0000-000000000000',
      firstName: '智',
      lastName: '佐藤',
      firstNameKana: 'サトル',
      lastNameKana: 'サトウ',
      expectedGraduationYear: 2027,
      grade: 'B2',
      position: null,
      studentId: 'k20000',
      slackDisplayName: 'k23075_佐藤智',
      iconUrl: 'https://satooru.me/icon.webp',
    },
  };

  return { member };
}

export default function Index() {
  const { member } = useLoaderData<LoaderResult>();

  return <MemberPage member={member} />;
}
