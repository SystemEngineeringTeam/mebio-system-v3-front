import type { Member, MemberPublicInfo } from '@/types/member';
import PrivateMemberProperties from '@/components/PrivateMemberProperties';
import PublicMemberProperties from '@/components/PublicMemberProperties';

interface Props {
  member: Member | MemberPublicInfo;
}

export default function MemberPage({ member }: Props) {
  return (
    <>
      <PublicMemberProperties editable={false} publicInfo={member.public} />
      {'private' in member && <PrivateMemberProperties editable={false} privateInfo={member.private} />}
    </>
  );
}
