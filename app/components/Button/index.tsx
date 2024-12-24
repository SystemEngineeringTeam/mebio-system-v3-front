import type { ButtonHTMLAttributes } from 'react';
import { styled } from 'restyle';

const ButtonBase = styled('button', {
  'height': '35px',
  'padding': '0px 15px',
  'fontSize': '15px',
  'fontWeight': '500',
  'lineHeight': '1',
  'backgroundColor': 'white',
  'borderRadius': '4px',
  'cursor': 'pointer',

  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...rest }: Props) {
  return <ButtonBase {...rest}>{children}</ButtonBase>;
}
