import { styled } from 'restyle';

const HeaderBase = styled('header', {
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  position: 'static',
  top: 0,
  left: 0,
  right: 0,

  backgroundColor: 'var(--on-background-color)',
});

const Title = styled('h1', {
  color: 'var(--background-color)',
  fontSize: '1rem',
});

export default function Header() {
  return (
    <HeaderBase>
      <Title>名簿システム</Title>
    </HeaderBase>
  );
}
