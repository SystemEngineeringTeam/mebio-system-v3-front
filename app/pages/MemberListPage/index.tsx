import type { MemberList } from '@/repository/member.repository';

interface Props {
  members: MemberList;
}

export default function MemberListPage({ members }: Props) {
  return (
    <div>
      <div className="my-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] place-items-center gap-10 px-10">
        {members.map((member) => (
          <div className="shadow-[0_2px_3px_rgba(0,0,0,0.25)]" key={member.id}>
            <a href={`/member/${member.id}`}>
              <img
                alt="Image"
                height={100}
                src={member.MemberBase?.iconUrl}
                width={200}
              />
              <div className="p-2">
                <p>
                  [
                  {member.MemberAlumni?.graduatedYear ?? member.MemberActive?.grade ?? member.MemberActiveExternal?.organization}
                  ]
                  {member.MemberActiveInternal?.studentId ?? member.MemberActiveExternal?.organization}
                </p>
                <p className="my-2">
                  {member.MemberBase?.lastName}
                  {member.MemberBase?.firstName}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
