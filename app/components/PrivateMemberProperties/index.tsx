import type { Member } from '@/types/member';
import MemberProperty from '@/components/MemberProperty';
import { GENDERS } from '@/consts/member';
import { styled } from 'restyle';

const SectionTitle = styled('h1', {
  textAlign: 'center',
  gridColumn: '1 / -1',
});

const SectionDescription = styled('p', {
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
  privateInfo: Member['private'];
}

export default function PrivateMemberProperties({ privateInfo, editable }: Props) {
  return (
    <GridSectopm>
      <SectionTitle>非公開情報</SectionTitle>
      <SectionDescription>この情報は役員と本人のみ閲覧できます</SectionDescription>

      <MemberProperty editable={editable} property="メールアドレス" type="text" value={privateInfo.email} />
      <MemberProperty editable={editable} property="電話番号" type="text" value={privateInfo.phoneNumber} />
      <MemberProperty editable={editable} property="誕生日" type="date" value={privateInfo.birthday} />
      <MemberProperty editable={editable} options={GENDERS} property="性別" type="select" value={privateInfo.gender} />
      <MemberProperty editable={editable} property="現郵便番号" type="text" value={privateInfo.currentAddress.zipCode} />
      <MemberProperty editable={editable} property="現住所" type="text" value={privateInfo.currentAddress.address} />
      <MemberProperty editable={editable} property="実家郵便番号" type="text" value={privateInfo.parentAddress.zipCode} />
      <MemberProperty editable={editable} property="実家住所" type="text" value={privateInfo.parentAddress.address} />
    </GridSectopm>
  );
}
