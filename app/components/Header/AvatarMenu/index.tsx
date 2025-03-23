import type { AuthUser } from '@/services/auth.server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@remix-run/react';

interface Props {
  user: AuthUser;
}

export default function AvatarMenu({ user }: Props) {
  return (

    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.iconUrl} />
          <AvatarFallback>{user.name}</AvatarFallback>
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
