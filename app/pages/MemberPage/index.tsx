import type { Member } from '@/services/member.server';
// import QRCode from '@/components/QRCode';
import { Button } from '@/components/ui/button';
import { Link } from '@remix-run/react';

interface Props {
  member: Member;
  memberPage: string;
}

export default function MemberPage({ member }: Props) {
  return (
    <main className="flex flex-col items-center justify-center gap-5" data-scrollable="false">
      {/* <QRCode value={memberPage} /> */}
      <p>{member.id}</p>

      <Button asChild>
        <Link target="_blank" to="/form">部員情報を登録</Link>
      </Button>
    </main>
  );
}
