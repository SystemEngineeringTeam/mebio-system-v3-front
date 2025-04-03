import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from 'remix-typedjson';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { memberService, formService } = context.db.services;
  const { authenticator } = context;
  const user = await authenticator.isAuthenticated(request);

  if (!user) throw new Response('認証に失敗しました', { status: 401 });

  const member = await memberService.selectFromSubject(user.id);
  const formUrl = await formService.getFormUrl(member.id);

  throw redirect(formUrl);
}
