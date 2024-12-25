import { authUserContext } from '@/components/AuthtContext';
import { Text } from '@/components/basic';
import * as RadixAvator from '@radix-ui/react-avatar';
import { Content as PopoverContent, Portal as PopoverPortal, Root as PopoverRoot, Trigger as PopoverTrigger } from '@radix-ui/react-popover';
import { Form, Link } from '@remix-run/react';
import { useContext } from 'react';
import { styled } from 'restyle';

const PopoverContentStyled = styled(PopoverContent, {
  'borderRadius': 'var(--radius-sm)',
  'padding': '10px',
  'width': '150px',
  'backgroundColor': 'var(--background-color)',
  'boxShadow': 'var(--shadow-color)',
  'animationDuration': '400ms',
  'animationTimingFunction': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'willChange': 'transform, opacity',
  'outline': 'none',

  '> *': {
    textAlign: 'center',
  },
});

const AvatarRootStyled = styled(RadixAvator.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: '30px',
  height: '30px',
  borderRadius: '100%',
  backgroundColor: 'var(--background-color)',
});

const AvatarImageStyled = styled(RadixAvator.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const AvatarFallbackStyled = styled(RadixAvator.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  color: 'var(--primary-color)',
  fontSize: '15px',
  lineHeight: 1,
  fontWeight: 500,
});

const MenuItems = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '10px',
  cursor: 'pointer',
});

const CutomButton = styled('button', {
  'padding': '5px 12px',
  'background': 'none',
  'border': 'none',
  'display': 'block',
  'width': '100%',
  'cursor': 'pointer',
  'outline': 'none',

  ':hover': {
    backgroundColor: 'var(--background-color-dark)',
  },
});

export default function Avatar() {
  const user = useContext(authUserContext);

  return (
    <>
      {user !== null
      && (
        <PopoverRoot>
          <PopoverTrigger asChild>
            <MenuItems>
              <AvatarRootStyled>
                <AvatarImageStyled src={user?.iconUrl} />
                <AvatarFallbackStyled delayMs={600}>
                  {user?.name.charAt(0)}
                </AvatarFallbackStyled>
              </AvatarRootStyled>

              <Text color="on-primary">{user?.name}</Text>
            </MenuItems>
          </PopoverTrigger>

          <PopoverPortal>
            <PopoverContentStyled sideOffset={10}>
              <Form action="/member" method="get">
                <CutomButton type="submit">
                  <Text color="text" size="md">My Page</Text>
                </CutomButton>
              </Form>

              <Form action="/logout" method="post">
                <CutomButton type="submit">
                  <Text color="text" size="md">Logout</Text>
                </CutomButton>
              </Form>
            </PopoverContentStyled>
          </PopoverPortal>
        </PopoverRoot>
      )}
    </>
  );
}
