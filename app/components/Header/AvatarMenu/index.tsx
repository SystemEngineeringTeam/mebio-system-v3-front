import { MemberContextType } from '@/components/MemberContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@remix-run/react';

interface Props {
  member: MemberContextType;
}

export default function AvatarMenu({ member }: Props) {
  console.log(member.base);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='bg-background'>
          <AvatarImage src={member.base.iconUrl} />
          <AvatarFallback>{member.base.lastName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/">トップへ</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link to="/member">プロフィール</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link to="/logout">ログアウト</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
