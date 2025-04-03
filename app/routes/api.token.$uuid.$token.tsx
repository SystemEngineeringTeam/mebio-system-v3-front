import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { MemberId } from '@/services/member.server';

export async function loader({ context, params }: LoaderFunctionArgs) {
  const { formService } = context.db.services;

  if (params.uuid === undefined) {
    throw new Response('UUID is required', { status: 400 });
  }
  if (params.token === undefined) {
    throw new Response('Token is required', { status: 400 });
  }

  const memberId = MemberId.from(params.uuid).match(
    (m) => m,
    () => { throw new Response('Invalid UUID', { status: 400 }); },
  );


  // 検証
  const isValid = await formService.verifyToken(
    memberId,
    params.token,
  );

  return new Response(
    String(isValid),
    { headers: { 'Content-Type': 'application/json' } },
  );
}
