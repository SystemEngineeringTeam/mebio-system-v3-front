import { styled } from 'restyle';

const FooterStyled = styled('footer', {
  padding: '5px',
  color: 'var(--background-color)',
  backgroundColor: 'var(--on-background-color)',
  textAlign: 'center',
});

export default function Footer() {
  return (
    <FooterStyled>SET © 2025 Copyright.</FooterStyled>
  );
}
