/* eslint-disable unused-imports/no-unused-vars */

import type { $Member } from '@/models/member';
import type { ModelEntityOf, ModelSchemaOf } from '@/types/model';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import type { ReactElement } from 'react';
import { MemberId } from '@/models/member';
import { Database } from '@/services/database.server';
import { ok } from 'neverthrow';
import { startTransition, useActionState } from 'react';

function MemberCardInfo({
  data: { id, email, createdAt, updatedAt },
}: {
  data: ModelSchemaOf<$Member>; // ← 部員のデータだけが必要で, 部員自身の操作は不要なので, ModelSchemaOf<$Member>.
}): ReactElement {
  return (
    <div>
      <p>
        id:
        <code>{id}</code>
      </p>
      <p>
        email:
        <code>{email}</code>
      </p>
      <p>
        createdAt:
        <code>{createdAt.toISOString()}</code>
      </p>
      <p>
        updatedAt:
        <code>{updatedAt.toISOString()}</code>
      </p>
    </div>
  );
}

function MemberCard(
  Member: ModelEntityOf<$Member>, // ← 部員自身の操作が必要なので, ModelEntityOf<$Member>.
): ReactElement {
  const { update } = Member;

  // ここは, SWR とかなんでも使ってどうぞ.
  const [member, updateMember, isPending] = useActionState(async () => {
    const newMember = await update(Member, { updatedAt: new Date() });

    if (newMember.isErr()) {
      // エラーに対するインタラクションなど
    }

    return newMember;
  }, ok(Member));

  return (
    <div>
      {member.match(
        (m) => <MemberCardInfo data={m.data} />,
        () => <p>部員の情報を取得できませんでした</p>,
      )}
      <button
        disabled={isPending}
        onClick={() => { startTransition(updateMember); }}
        type="button"
      >
        {isPending ? '更新中...' : '更新'}
      </button>
    </div>
  );
}

async function fakeLoader({ context }: LoaderFunctionArgs) {
  const { Member } = context.db.models;

  const memberIdInput = '0188c0f2-8e47-11ec-b909-0242ac120002';
  const memberId = MemberId.from(memberIdInput).match(
    (id) => id,
    () => {
      throw new Response('不正な部員 ID です', { status: 400 });
    },
  );

  const member = await Member.from(memberId).match(
    (m) => m,
    Database.unwrapToResponse,
  );

  return member;
}

// ...
