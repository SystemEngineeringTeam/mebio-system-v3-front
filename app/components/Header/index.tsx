import authUserContext from '@/components/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@remix-run/react';
import { useContext } from 'react';

export default function Header() {
  const user = useContext(authUserContext);

  return (
    <header className="flex h-[var(--header-height)] items-center bg-primary px-5 font-bold text-primary-foreground">
      <Link to="/">名簿システム</Link>

      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.iconUrl} />
              <AvatarFallback>{user?.name}</AvatarFallback>
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
      </div>
    </header>
  );
}
