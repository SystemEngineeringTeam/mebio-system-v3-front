import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import MemberPage from '@/pages/MemberPage';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { memberService } = context.db.services;
  const { authenticator } = context;
  const user = await authenticator.isAuthenticated(request);

  if (!user) throw new Response('認証に失敗しました', { status: 401 });

  const member = await memberService.selectFromSubject(user.id);

  const url = new URL(request.url);
  url.pathname = member.id;

  return typedjson({ member, memberPage: url.toString() });
}

export default function Index() {
  const { member, memberPage } = useTypedLoaderData<typeof loader>();

  return <MemberPage member={member} memberPage={memberPage} />;
};
