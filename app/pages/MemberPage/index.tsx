import type { Member } from '@/services/member.server';
import QRCode from '@/components/QRCode';

interface Props {
  member: Member;
  memberPage: string;
}

export default function MemberPage({ member, memberPage }: Props) {
  return (
    <div className="p-20">
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4">
        <QRCode value={memberPage} />
        <p>{member.id}</p>
      </div>
    </div>
  );
}
