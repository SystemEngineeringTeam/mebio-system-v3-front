import type { Member, MemberPublicInfo } from '@/types/member';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import MemberPage from '@/pages/MemberPage';
import { redirect, useLoaderData, useRouteError } from '@remix-run/react';

interface LoaderData {
  isEditable: boolean;
  member: Member | MemberPublicInfo;
}

export function loader({ params }: LoaderFunctionArgs): LoaderData | Response {
  if (params['uuid'] === 'edit') {
    const uuid = '00000000-0000-0000-0000-000000000000';
    return redirect(`/member/${uuid}/edit`, { status: 303 });
  }

  // TODO: 置き換える
  if (params['uuid'] === undefined) {
    const member: Member = {
      isAdmin: false,
      status: 'registered',
      public: {
        type: 'active',
        uuid: params['uuid'] ?? '00000000-0000-0000-0000-000000000000',
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
        currentAddressZipCode: '000-0000',
        currentAddress: '愛知県名古屋市中区栄0-0-0',
        parentAddressZipCode: '111-1111',
        parentAddress: '愛知県名古屋市中区栄1-1-1',
      },
    };
    return { isEditable: true, member };
  }

  if (params['uuid'].length < 5) {
    throw new Response(null, { status: 404 });
  }

  const member: MemberPublicInfo = {
    public: {
      type: 'active',
      uuid: params['uuid'] ?? '00000000-0000-0000-0000-000000000000',
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
  return { isEditable: false, member };
}

export default function Index() {
  const { isEditable, member } = useLoaderData<LoaderData>();
  return <MemberPage isEditable={isEditable} member={member} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="部員情報" />;
}
