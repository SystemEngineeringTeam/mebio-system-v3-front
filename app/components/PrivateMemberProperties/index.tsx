import type { SetPrivateProperty } from '@/hooks/useEditMember';
import type { Member } from '@/types/member';
import { Text } from '@/components/basic';
import MemberProperty from '@/components/MemberProperty';
import { GENDERS } from '@/consts/member';
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
  privateInfo: Member['private'];
  setProperty?: SetPrivateProperty;
}

export default function PrivateMemberProperties({ privateInfo, editable }: Props) {
  return (
    <GridSectopm>
      <SectionTitleGroup>
        <h1>非公開情報</h1>
        <Text>この情報は本人と役員のみ閲覧できます</Text>
      </SectionTitleGroup>

      <MemberProperty editable={editable} property="メールアドレス" type="text" value={privateInfo.email} />
      <MemberProperty editable={editable} property="電話番号" type="text" value={privateInfo.phoneNumber} />
      <MemberProperty editable={editable} property="誕生日" type="date" value={new Date(privateInfo.birthday)} />
      <MemberProperty editable={editable} options={GENDERS} property="性別" type="select" value={privateInfo.gender} />
      <MemberProperty editable={editable} property="現郵便番号" type="text" value={privateInfo.currentAddress.zipCode} />
      <MemberProperty editable={editable} property="現住所" type="text" value={privateInfo.currentAddress.address} />
      <MemberProperty editable={editable} property="実家郵便番号" type="text" value={privateInfo.parentAddress.zipCode} />
      <MemberProperty editable={editable} property="実家住所" type="text" value={privateInfo.parentAddress.address} />
    </GridSectopm>
  );
}
