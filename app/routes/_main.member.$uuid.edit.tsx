import type { Member } from '@/types/member';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import MemberEditPage from '@/pages/MemberEditPage';
import { zUpdateMember } from '@/schema/member';
import { redirect, useLoaderData, useRouteError } from '@remix-run/react';
import destr from 'destr';

interface LoaderData {
  member: Member;
}

export function loader({ params }: LoaderFunctionArgs) {
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
  return { member };
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const memberRes = zUpdateMember.safeParse(destr(body.get('member')));

  if (!memberRes.success) return memberRes.error;

  // TODO: 更新処理 (memberRes.data) UUID や position が勝手に変更されないように注意

  const url = new URL(request.url);
  // 1つ上の階層にリダイレクト
  url.pathname = url.pathname.replace(/\/[^/]+$/, '');
  return redirect(url.toString());
}

export default function Index() {
  const { member } = useLoaderData<LoaderData>();
  return <MemberEditPage member={member} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="部員情報" />;
}
