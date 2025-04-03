import authUserContext from '@/components/AuthContext';
import AvatarMenu from '@/components/Header/AvatarMenu';
import { Button } from '@/components/ui/button';
import { Form, Link } from '@remix-run/react';
import { useContext } from 'react';

export default function Header() {
  const data = useContext(authUserContext);

  return (
    <header className="flex h-[var(--header-height)] items-center bg-primary px-5 font-bold text-primary-foreground">
      <Link to="/">名簿システム</Link>

      <div className="ml-auto flex items-center">
        {data
          ? <AvatarMenu data={data} />
          : (
            <Form action="/auth/login" method="post">
              <Button className="text-primary" size="sm" variant="outline" type="submit">ログイン</Button>
            </Form>
          )}
      </div>
    </header>
  );
}
