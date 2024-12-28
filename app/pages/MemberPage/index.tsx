import type { Member, MemberPublicInfo } from '@/types/member';
import { Button } from '@/components/basic';
import PrivateMemberProperties from '@/components/PrivateMemberProperties';
import PublicMemberProperties from '@/components/PublicMemberProperties';
import { Link } from '@remix-run/react';
import { styled } from 'restyle';

const NavSection = styled('section', {
  padding: '50px 0',
  marginInline: 'auto',
  width: 'fit-content',
  display: 'flex',
  gap: '30px',
});

const LinkStyled = styled(Link, {
  color: 'var(--on-primary-color)',
  textDecoration: 'none',
});

interface Props {
  isEditable: boolean;
  member: Member | MemberPublicInfo;
}

export default function MemberPage({ isEditable, member }: Props) {
  return (
    <>
      <PublicMemberProperties editable={false} publicInfo={member.public} />
      {'private' in member && <PrivateMemberProperties editable={false} privateInfo={member.private} />}

      <NavSection>
        {isEditable && (
          <Button type="button">
            <LinkStyled to="./edit" type="reset">編集</LinkStyled>
          </Button>
        )}
      </NavSection>
    </>
  );
}
