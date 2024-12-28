import type { Property } from '@/components/MemberProperty';
import type { SetPrivateProperty } from '@/hooks/useEditMember';
import type { Member } from '@/types/member';
import { Text } from '@/components/basic';
import MemberProperty from '@/components/MemberProperty';
import { GENDERS } from '@/consts/member';
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
  privateInfo: Member['private'];
  setProperty?: SetPrivateProperty;
}

export default function PrivateMemberProperties({ privateInfo, editable, disabledProperty, setProperty }: Props) {
  const parseValue = useCallback((value: string, type: Property['type']) => {
    if (type === 'number') return Number.parseInt(value);
    if (type === 'date') return new Date(value);
    return value;
  }, []);

  const set: SetPrivateProperty = useCallback((key, value) => {
    if (setProperty) setProperty(key, value);
  }, [setProperty]);

  return (
    <GridSectopm>
      <SectionTitleGroup>
        <h1>非公開情報</h1>
        <Text>この情報は本人と役員のみ閲覧できます</Text>
      </SectionTitleGroup>

      <MemberProperty disabled={disabledProperty?.includes('email')} editable={editable} onChange={(v) => { set('email', parseValue(v, 'text')); }} property="メールアドレス" type="text" value={privateInfo.email} />
      <MemberProperty disabled={disabledProperty?.includes('phoneNumber')} editable={editable} onChange={(v) => { set('phoneNumber', parseValue(v, 'text')); }} property="電話番号" type="text" value={privateInfo.phoneNumber} />
      <MemberProperty disabled={disabledProperty?.includes('birthday')} editable={editable} onChange={(v) => { set('birthday', parseValue(v, 'date')); }} property="誕生日" type="date" value={new Date(privateInfo.birthday)} />
      <MemberProperty disabled={disabledProperty?.includes('gender')} editable={editable} onChange={(v) => { set('gender', parseValue(v, 'select')); }} options={GENDERS} property="性別" type="select" value={privateInfo.gender} />
      <MemberProperty disabled={disabledProperty?.includes('currentAddressZipCode')} editable={editable} onChange={(v) => { set('currentAddressZipCode', parseValue(v, 'text')); }} property="現郵便番号" type="text" value={privateInfo.currentAddressZipCode} />
      <MemberProperty disabled={disabledProperty?.includes('currentAddress')} editable={editable} onChange={(v) => { set('currentAddress', parseValue(v, 'text')); }} property="現住所" type="text" value={privateInfo.currentAddress} />
      <MemberProperty disabled={disabledProperty?.includes('parentAddressZipCode')} editable={editable} onChange={(v) => { set('parentAddressZipCode', parseValue(v, 'text')); }} property="実家郵便番号" type="text" value={privateInfo.parentAddressZipCode} />
      <MemberProperty disabled={disabledProperty?.includes('parentAddress')} editable={editable} onChange={(v) => { set('parentAddress', parseValue(v, 'text')); }} property="実家住所" type="text" value={privateInfo.parentAddress} />
    </GridSectopm>
  );
}
