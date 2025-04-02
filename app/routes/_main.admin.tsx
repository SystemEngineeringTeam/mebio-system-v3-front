import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import AdminPage from '@/pages/AdminPage';
import { MemberRepository } from '@/repository/member.repository';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export async function loader({ context }: LoaderFunctionArgs) {
  const members = await MemberRepository.listWithSensitive(context.__prisma);
  return typedjson({ members });
}

export type AdminLoaderData = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const { members } = useTypedLoaderData<typeof loader>();
  return <AdminPage members={members}/>;
};
