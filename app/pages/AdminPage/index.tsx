import type { AdminLoaderData } from '@/routes/_main.admin';

export default function AdminPage(members: AdminLoaderData) {
  return (
    <div>
      <table className="mx-auto my-10 grid max-w-[600px] grid-cols-1 place-items-center gap-20 p-4 text-left sm:grid-cols-2">
        <thead>
          <tr>
            <th className="text-lg font-bold">ユーザーID</th>
            <th className="text-lg font-bold">アイコン</th>
            <th className="text-lg font-bold">名前</th>
            <th className="text-lg font-bold">フリガナ</th>
            <th className="text-lg font-bold">学年</th>
            <th className="text-lg font-bold">卒業年度</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  );
}
