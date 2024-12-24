import type { Dispatch } from 'react';
import { Close, Content, Description, Overlay, Portal, Root, Title } from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { keyframes, styled } from 'restyle';

interface Props {
  open: boolean;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
}

const OverlayShowAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const OverlayStyled = styled(Overlay, {
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  inset: 0,
  animation: `${OverlayShowAnimation} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
});

const ContentShowAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const ContentStyled = styled(Content, {
  'backgroundColor': 'white',
  'borderRadius': 6,
  'boxShadow': 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  'position': 'fixed',
  'top': '50%',
  'left': '50%',
  'transform': 'translate(-50%, -50%)',
  'width': '90vw',
  'maxWidth': 450,
  'maxHeight': '85vh',
  'padding': 25,
  'animation': `${ContentShowAnimation} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,

  '&:focus': {
    outline: 'none',
  },
});

const TitleStyled = styled(Title, {
  margin: 0,
  fontWeight: 500,
  fontSize: 17,
});

const DescriptionStyled = styled(Description, {
  margin: '10px 0 20px',
  fontSize: 15,
  lineHeight: 1.5,
});

const CloseStyled = styled(Close, {
  'backgroundColor': 'transparent',
  'border': 'none',
  'position': 'absolute',
  'top': 10,
  'right': 10,
  'cursor': 'pointer',

  '&:focus': {
    outline: 'none',
  },
});

export default function Dialog({ open, onOpenChange }: Props) {
  return (
    <Root onOpenChange={onOpenChange} open={open}>
      <Portal>
        <OverlayShowAnimation />
        <OverlayStyled />

        <ContentShowAnimation />
        <ContentStyled>
          <TitleStyled>Hello, Radix!</TitleStyled>
          <DescriptionStyled>This is Radix Primitives Dialog Component.</DescriptionStyled>
          <CloseStyled>
            <Cross2Icon />
          </CloseStyled>
        </ContentStyled>
      </Portal>
    </Root>
  );
};
