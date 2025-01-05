import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { MemberId } from '@/utils/models/member';
import { useLoaderData } from '@remix-run/react';

export async function loader({ context }: LoaderFunctionArgs) {
  const { db } = context;
  const { Member } = db.models;
  const member = (await Member.factories.from(
    MemberId.from('0188c0f2-8e47-11ec-b909-0242ac120002')._unsafeUnwrap(),
  ))._unsafeUnwrap();

  return { member };
}

export default function Index() {
  const { member } = useLoaderData<typeof loader>();

  return (
    <div>
      <div>test</div>
      <textarea
        defaultValue={JSON.stringify(member, null, 2)}
        style={{
          width: '100%',
          minHeight: '10lh',
          // @ts-expect-error お NEW なプロパティ
          fieldSizing: 'content',
        }}
      />
    </div>
  );
}
