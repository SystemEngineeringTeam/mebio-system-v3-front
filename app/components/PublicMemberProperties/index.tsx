import type { Member } from '@/types/member';
import MemberProperty from '@/components/MemberProperty';
import { TYPES } from '@/consts/member';
import { toTypeName } from '@/utils';
import { styled } from 'restyle';

const SectionTitle = styled('h1', {
  textAlign: 'center',
  gridColumn: '1 / -1',
});

const GridSectopm = styled('section', {
  padding: '50px 0',
  marginInline: 'auto',
  maxWidth: 'fit-content',
  display: 'grid',
  gridTemplateColumns: '200px 300px',
  gap: '40px 20px',
});

interface Props {
  editable: boolean;
  publicInfo: Member['public'];
}

export default function PublicMemberProperties({ publicInfo, editable }: Props) {
  const fullName = `${publicInfo.lastName} ${publicInfo.firstName}`;
  const fullNameKana = `${publicInfo.lastNameKana} ${publicInfo.firstNameKana}`;
  const slackDisplayName = `@${publicInfo.slackDisplayName}`;

  return (
    <GridSectopm>
      <SectionTitle>公開情報</SectionTitle>

      <MemberProperty editable={editable} property="ユーザID" type="text" value={publicInfo.uuid} />
      <MemberProperty editable={editable} property="名前" type="text" value={fullName} />
      <MemberProperty editable={editable} property="名前(カナ)" type="text" value={fullNameKana} />
      <MemberProperty editable={editable} property="Slack表示名" type="text" value={slackDisplayName} />
      <MemberProperty editable={editable} property="アイコン" type="icon" value={publicInfo.iconUrl} />
      <MemberProperty editable={editable} options={TYPES} property="タイプ" type="select" value={publicInfo.type} />

      {
        publicInfo.type === 'active' && (
          <>
            <MemberProperty editable={editable} property="学籍番号" type="text" value={publicInfo.studentId} />
            <MemberProperty editable={editable} property="卒業予定年度" type="number" value={publicInfo.expectedGraduationYear} />
            <MemberProperty editable={editable} property="役職" type="text" value={publicInfo.position ?? '-'} />
          </>
        )
      }
    </GridSectopm>
  );
}
