import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import AdminPage from '@/pages/AdminPage';
import { typedjson } from 'remix-typedjson';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { memberService } = context.db.services;
  const { authenticator } = context;
  const user = await authenticator.isAuthenticated(request);

  if (!user) throw new Response('認証に失敗しました', { status: 401 });

  const member = await memberService.selectFromSubject(user.id);
  if (!member.admin) throw new Response('管理者権限がありません', { status: 403 });

  return typedjson({ member });
}

export default function Index() {
  return <AdminPage />;
};
