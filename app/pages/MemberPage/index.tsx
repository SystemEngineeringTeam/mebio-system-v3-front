import type { Member } from '@/services/member.server';
import QRCode from '@/components/QRCode';
import { Button } from '@/components/ui/button';
import { Link } from '@remix-run/react';

interface Props {
  member: Member;
  memberPage: string;
}

export default function MemberPage({ member, memberPage }: Props) {
  return (
    <main className="flex items-center justify-center flex-col gap-5" data-scrollable='false'>
      <QRCode value={memberPage} />
      <p>{member.id}</p>

      <Button asChild>
        <Link to='/form' target='_blank'>部員情報を登録</Link>
      </Button>
    </main>
  );
}
