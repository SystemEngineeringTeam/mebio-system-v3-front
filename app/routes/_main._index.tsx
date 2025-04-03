import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import MemberPage from '@/pages/MemberPage';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { memberService } = context.db.services;
  const { authenticator } = context;
  const user = await authenticator.isAuthenticated(request);

  if (!user) throw new Response('認証に失敗しました', { status: 401 });

  const member = await memberService.selectFromSubject(user.id);

  return typedjson({ member });
}

export default function Index() {
  const { member } = useTypedLoaderData<typeof loader>();

  return <MemberPage member={member} />;
};
