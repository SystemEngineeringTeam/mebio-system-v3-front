import type { Member } from "@/services/member.server";
import QRCode from "@/components/QRCode";

interface Props {
  member: Member;
  memberPage: string;
}

export default function MemberPage({ member, memberPage }: Props) {
  return (
    <div className="p-20">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4 items-center">
        <QRCode value={memberPage} />
        <p>{member.id}</p>
      </div>
    </div>
  );
}
