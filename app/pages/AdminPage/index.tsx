import type { AdminLoaderData } from '@/routes/_main.admin';

export default function AdminPage({ members }: { members: AdminLoaderData }) {
  return (
    <div className="my-10 flex items-center justify-center">
      <table className="mx-3 w-full max-w-7xl border-collapse border border-gray-300 text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-lg font-bold">ユーザーID</th>
            <th className="border border-gray-300 p-2 text-lg font-bold">アイコン</th>
            <th className="border border-gray-300 p-2 text-lg font-bold">名前</th>
            <th className="border border-gray-300 p-2 text-lg font-bold">学年</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td className="border border-gray-300 p-2 text-lg">{member.id}</td>
              <td className="border border-gray-300 p-2 text-lg">
                <img alt="icon" className="mx-auto size-12" src={member.MemberBase?.iconUrl} />
              </td>
              <td className="border border-gray-300 p-2 text-lg">
                {member.MemberBase?.lastName}
                {member.MemberBase?.firstName}
              </td>
              <td className="border border-gray-300 p-2 text-lg">{member.MemberActive?.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}
