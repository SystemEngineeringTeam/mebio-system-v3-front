import type { MemberList } from "@/repository/member.repository";

interface Props {
  members: MemberList;
}

export default function MemberListPage({ members }: Props) {
  return (
    <div>
      <h1>メンバー一覧画面</h1>

      <div>
        {members.map((member) => (
          <div key={member.id}>
            {member.id}
          </div>
        ))}
      </div>
    </div>
  );
}
