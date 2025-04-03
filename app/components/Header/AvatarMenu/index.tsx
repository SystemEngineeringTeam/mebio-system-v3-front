import type { AuthUserContext } from '@/components/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@remix-run/react';

interface Props {
  data: AuthUserContext;
}

export default function AvatarMenu({ data }: Props) {
  return (

    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data.user.iconUrl} />
          <AvatarFallback>{data.user.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/">プロフィール</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link to="/logout">ログアウト</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
