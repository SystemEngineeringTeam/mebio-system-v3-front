import { styled } from 'restyle';

const FooterStyled = styled('footer', {
  height: 'var(--footer-height)',
  color: 'var(--background-color)',
  backgroundColor: 'var(--on-background-color)',
  textAlign: 'center',
  lineHeight: 'var(--footer-height)',
});

export default function Footer() {
  return (
    <FooterStyled>SET © 2025 Copyright.</FooterStyled>
  );
}
