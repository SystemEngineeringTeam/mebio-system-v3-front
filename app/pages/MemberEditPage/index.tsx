import type { Member } from '@/types/member';
import authUserContext from '@/components/AuthtContext';
import { Button } from '@/components/basic';
import PrivateMemberProperties from '@/components/PrivateMemberProperties';
import PublicMemberProperties from '@/components/PublicMemberProperties';
import useEditMember from '@/hooks/useEditMember';
import { Form, Link } from '@remix-run/react';
import { useContext, useMemo } from 'react';
import { styled } from 'restyle';

const FormStyled = styled(Form, {
  'padding': '50px 0',

  '> div': {
    marginInline: 'auto',
    width: 'fit-content',
    display: 'flex',
    gap: '30px',
  },
});

const LinkStyled = styled(Link, {
  color: 'var(--primary-color)',
  textDecoration: 'none',
});

interface Props {
  member: Member;
}

export default function MemberEditPage({ member: initMember }: Props) {
  const { member, setPublicProperty, setPrivateProperty } = useEditMember(initMember);
  const user = useContext(authUserContext);

  const disabledProperty = useMemo(() => user?.isAdmin === true ? ['uuid', 'position'] : ['uuid'], [user?.isAdmin]);
  const publicInfo = { ...initMember.public, ...member.public };
  const privateInfo = { ...initMember.private, ...member.private };

  return (
    <>
      <PublicMemberProperties disabledProperty={disabledProperty} editable publicInfo={publicInfo} setProperty={setPublicProperty} />
      <PrivateMemberProperties editable privateInfo={privateInfo} setProperty={setPrivateProperty} />

      <FormStyled action="." method="post">
        <div>
          <Button outline type="button">
            <LinkStyled to={`/member/${initMember.public.uuid}`} type="reset">キャンセル</LinkStyled>
          </Button>
          <Button type="submit">保存</Button>
          <input
            name="member"
            type="hidden"
            value={JSON.stringify(member)}
          />
        </div>
      </FormStyled>
    </>
  );
}
