import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import MemberListPage from '@/pages/MemberListPage';
import { MemberRepository } from '@/repository/member.repository';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export function meta() {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
}

export async function loader({ context }: LoaderFunctionArgs) {
  const members = await MemberRepository.list(context.__prisma);
  return typedjson({ members });
}

export default function Index() {
  const { members } = useTypedLoaderData<typeof loader>();

  return <MemberListPage members={[...members,...members,...members,...members,...members,...members,...members]} />;
};
