import { Link } from '@remix-run/react';
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
  gap: '10px',
});

export default function Header() {
  return (
    <HeaderStyled>
      <Title to="/">名簿システム</Title>

      <Menu>
        <Avatar />
      </Menu>
    </HeaderStyled>
  );
}
