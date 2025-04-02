import type { LoaderData } from '@/routes/_main.member.($uuid)';

interface Props {
  member: LoaderData;
}
export default function MemberPage({ member }: Props) {
  return (
    <div className="mx-auto my-10 grid max-w-[600px] grid-cols-1 place-items-center gap-20 p-4 text-left sm:grid-cols-2">
      <h2 className="text-lg font-bold">ユーザーID</h2>
      <p>{member.member.id}</p>

      <h2 className="text-lg font-bold">アイコン</h2>
      <img alt="Image" height={100} src={member.base.iconUrl} width={200} />

      <h2 className="text-lg font-bold">名前</h2>
      <p>{member.base.lastName + member.base.firstName}</p>

      <h2 className="text-lg font-bold">フリガナ</h2>
      <p>{member.base.lastNameKana + member.base.firstNameKana}</p>

      {member.type === 'ACTIVE' && (
        <>
          <h2 className="text-lg font-bold">学年</h2>
          <p>{member.detail.grade}</p>
        </>
      )}
      {member.type === 'ALUMNI' && (
        <>
          <h2 className="text-lg font-bold">卒業年度</h2>

          <div>
            {member.detail.graduatedYear}
          </div>
        </>
      )}
    </div>
  );
}
