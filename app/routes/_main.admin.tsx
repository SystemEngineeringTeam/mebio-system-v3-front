import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import AdminPage from '@/pages/AdminPage';
import { MemberId } from '@/services/member.server';
import { useActionData } from '@remix-run/react';
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

export async function action({ context, request }: LoaderFunctionArgs) {
  const { memberService } = context.db.services;
  const { authenticator } = context;
  const user = await authenticator.isAuthenticated(request);

  if (!user) throw new Response('認証に失敗しました', { status: 401 });

  const formData = await request.formData();
  const target = formData.get('memberId') as string;
  const targetMemberId = MemberId.from(target).match(
    (m) => m,
    () => { throw new Response(`不正なリクエストです: ${target}`, { status: 400 }); }
  );

  const message = (await memberService.approve(targetMemberId, user.id)).match(
    () => `${target}: 承認しました`,
    (e) => e,
  );

  return message;
}

export default function Index() {
  const message = useActionData<typeof action>();

  return <AdminPage message={message} />;
};
