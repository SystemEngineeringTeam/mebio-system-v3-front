import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import MemberPage from '@/pages/MemberPage';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { memberService } = context.db.services;
  const { authenticator } = context;
  const user = await authenticator.isAuthenticated(request);

  console.log('ok1', user);
  if (!user) throw new Response('認証に失敗しました', { status: 401 });

  console.log('ok2');
  const member = await memberService.selectFromSubject(user.id);

  console.log('ok3', member);
  const url = new URL(context.cloudflare.env.CF_PAGES_URL);
  url.pathname = member.id;
  
  console.log('ok4', url);
  return typedjson({ member, memberPage: url.toString() });
}

export default function Index() {
  const { member, memberPage } = useTypedLoaderData<typeof loader>();

  return <MemberPage member={member} memberPage={memberPage} />;
};
