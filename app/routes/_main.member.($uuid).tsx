import type { $Member } from '@/models/member';
import type { $MemberActive } from '@/models/member/active';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { $MemberBase } from '@/models/member/base';
import type { ModelSchemaOf } from '@/types/model';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { MemberId } from '@/models/member';
import ErrorBoundaryPage from '@/pages/ErrorBoundaryPage';
import MemberPage from '@/pages/MemberPage';
import { Database } from '@/services/database.server';
import { useRouteError } from '@remix-run/react';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export type LoaderData = {
  member: ModelSchemaOf<$Member>;
  base: ModelSchemaOf<$MemberBase>;
} & ({
  type: 'ACTIVE';
  detail: ModelSchemaOf<$MemberActive>;
} | {
  type: 'ALUMNI';
  detail: ModelSchemaOf<$MemberAlumni>;
});

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { Member } = context.db.models;

  if (params.uuid === undefined) {
    throw new Response('uuid が見つかりません', { status: 404 });
  }

  const memberId = MemberId
    .from(params.uuid)
    .match(
      (id) => id,
      () => {
        throw new Response('不正な部員 ID です', { status: 400 });
      },
    );

  const member = await Member
    .fromWithResolved(memberId)
    .andThen((m) => m.buildBySelf())
    .match(
      (m) => m,
      Database.unwrapToResponse,
    );
  const memberBase = member.dataResolved.member.Base().match(
    (m) => m,
    Database.unwrapToResponse,
  );

  if (member.dataResolved.member.detail.type === 'ACTIVE') {
    const memberDetail = member.dataResolved.member.detail.Data().match(
      (m) => m,
      Database.unwrapToResponse,
    );
    return typedjson({
      member: member.data,
      base: memberBase.data,
      type: 'ACTIVE',
      detail: memberDetail.data,
    });
  }
  const memberDetail = member.dataResolved.member.detail.Data().match(
    (m) => m,
    Database.unwrapToResponse,
  );
  return typedjson({
    member: member.data,
    base: memberBase.data,
    type: 'ALUMNI',
    detail: memberDetail.data,
  });
}

export default function Index() {
  const member = useTypedLoaderData<LoaderData>();

  return <MemberPage member={member} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryPage error={error} notFoundItem="部員情報" />;
}
