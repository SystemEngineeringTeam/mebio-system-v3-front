import authUserContext from '@/components/AuthtContext';
import { Link } from '@remix-run/react';
import { useContext } from 'react';
import { styled } from 'restyle';
import Avatar from './Avatar';

const HeaderStyled = styled('header', {
  padding: '0 20px',
  backgroundColor: 'var(--on-background-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'static',
  top: 0,
  left: 0,
  right: 0,
});

const Title = styled(Link, {
  color: 'var(--background-color)',
  fontSize: 'var(--fontsize-md)',
  fontWeight: 'bold',
  textDecoration: 'none',
});

const Menu = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
});

const LinkStyled = styled(Link, {
  color: 'var(--background-color)',
  textDecoration: 'none',
  fontSize: 'var(--fontsize-md)',
  cursor: 'pointer',
});

export default function Header() {
  const user = useContext(authUserContext);

  return (
    <HeaderStyled>
      <Title to="/">名簿システム</Title>

      <Menu>
        {user?.isAdmin === true && <LinkStyled to="/admin">管理者</LinkStyled>}
        {user !== null && <Avatar user={user} />}
      </Menu>
    </HeaderStyled>
  );
}
