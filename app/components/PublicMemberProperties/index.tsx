import type { Property } from '@/components/MemberProperty';
import type { SetPublicProperty } from '@/hooks/useEditMember';
import type { Member } from '@/types/member';
import { Text } from '@/components/basic';
import MemberProperty from '@/components/MemberProperty';
import { POSITIONS, TYPES } from '@/consts/member';
import { useCallback } from 'react';
import { styled } from 'restyle';

const SectionTitleGroup = styled('div', {
  gridColumn: '1 / -1',
  textAlign: 'center',
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
  disabledProperty?: string[];
  publicInfo: Partial<Member['public']>;
  setProperty?: SetPublicProperty;
}

export default function PublicMemberProperties({ publicInfo, editable, disabledProperty, setProperty }: Props) {
  const parseValue = useCallback((value: string, type: Property['type']) => {
    if (type === 'number') return Number(value);
    if (type === 'date') return new Date(value);
    return value;
  }, []);

  const set: SetPublicProperty = useCallback((key, value) => {
    if (setProperty) setProperty(key, value);
  }, [setProperty]);

  return (
    <GridSectopm>
      <SectionTitleGroup>
        <h1>公開情報</h1>
        <Text>この情報は全部員が閲覧できます</Text>
      </SectionTitleGroup>

      <MemberProperty disabled={disabledProperty?.includes('uuid')} editable={editable} onChange={(v) => { set('uuid', parseValue(v, 'text')); }} property="ユーザID" type="text" value={publicInfo.uuid} />
      <MemberProperty disabled={disabledProperty?.includes('lastName')} editable={editable} onChange={(v) => { set('lastName', parseValue(v, 'text')); }} property="姓" type="text" value={publicInfo.lastName} />
      <MemberProperty disabled={disabledProperty?.includes('firstName')} editable={editable} onChange={(v) => { set('firstName', parseValue(v, 'text')); }} property="名" type="text" value={publicInfo.firstName} />
      <MemberProperty disabled={disabledProperty?.includes('lastName')} editable={editable} onChange={(v) => { set('lastName', parseValue(v, 'text')); }} property="姓(カナ)" type="text" value={publicInfo.lastNameKana} />
      <MemberProperty disabled={disabledProperty?.includes('firstName')} editable={editable} onChange={(v) => { set('firstName', parseValue(v, 'text')); }} property="名(カナ)" type="text" value={publicInfo.firstNameKana} />
      <MemberProperty disabled={disabledProperty?.includes('slackDisplayName')} editable={editable} onChange={(v) => { set('slackDisplayName', parseValue(v, 'text')); }} property="Slack表示名" type="text" value={publicInfo.slackDisplayName} />
      <MemberProperty disabled={disabledProperty?.includes('iconUrl')} editable={editable} onChange={(v) => { set('iconUrl', parseValue(v, 'icon')); }} property="アイコン" type="icon" value={publicInfo.iconUrl} />
      <MemberProperty disabled={disabledProperty?.includes('type')} editable={editable} onChange={(v) => { set('type', TYPES.find((t) => t.name === v)?.key); }} options={TYPES} property="タイプ" type="select" value={publicInfo.type} />

      {
        publicInfo.type === 'active' && (
          <>
            <MemberProperty disabled={disabledProperty?.includes('studentId')} editable={editable} onChange={(v) => { set('studentId', parseValue(v, 'text')); }} property="学籍番号" type="text" value={publicInfo.studentId} />
            <MemberProperty disabled={disabledProperty?.includes('expectedGraduationYear')} editable={editable} onChange={(v) => { set('expectedGraduationYear', parseValue(v, 'number')); }} property="卒業予定年度" type="number" value={publicInfo.expectedGraduationYear ?? Number.NaN} />
            <MemberProperty disabled={disabledProperty?.includes('position')} editable={editable} onChange={(v) => { set('position', POSITIONS.find((p) => p === v)); }} options={['-', ...POSITIONS].map((p) => ({ key: p, name: p }))} property="役職" type="select" value={publicInfo.position ?? '-'} />
          </>
        )
      }
      {
        publicInfo.type === 'alumni' && (
          <>
            <MemberProperty disabled={disabledProperty?.includes('graduationYear')} editable={editable} onChange={(v) => { set('graduationYear', parseValue(v, 'number')); }} property="卒業年度" type="number" value={publicInfo.graduationYear ?? Number.NaN} />
            <MemberProperty disabled={disabledProperty?.includes('oldPosition')} editable={editable} onChange={(v) => { set('oldPosition', parseValue(v, 'text')); }} property="旧役職" type="text" value={publicInfo.oldPosition ?? undefined} />
          </>
        )
      }
      {
        publicInfo.type === 'external' && (
          <>
            <MemberProperty disabled={disabledProperty?.includes('schoolName')} editable={editable} onChange={(v) => { set('schoolName', parseValue(v, 'text')); }} property="学校名" type="text" value={publicInfo.schoolName} />
            <MemberProperty disabled={disabledProperty?.includes('organization')} editable={editable} onChange={(v) => { set('organization', parseValue(v, 'text')); }} property="団体名" type="text" value={publicInfo.organization} />
          </>
        )
      }
    </GridSectopm>
  );
}
