import type { Member } from '@/types/member';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import MemberEditPage from '@/pages/MemberEditPage';
import { useLoaderData, useRouteError } from '@remix-run/react';

interface LoaderData {
  member: Member;
}

export function loader({ params }: LoaderFunctionArgs) {
  const member: Member = {
    isAdmin: false,
    status: 'registered',
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
      birthday: '2005-01-05',
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

export default function Index() {
  const { member } = useLoaderData<LoaderData>();
  return <MemberEditPage member={member} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="部員情報" />;
}
