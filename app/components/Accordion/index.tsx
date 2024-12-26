import { styled } from 'restyle';

interface Props extends React.HTMLAttributes<HTMLDetailsElement> {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}

const Details = styled('details', {
  padding: '10px 0',
});

const Summary = styled('summary', {
  userSelect: 'none',
  cursor: 'pointer',
});

const Title = styled('h2', {
  display: 'inline',
});

export default function Accordion({ title, children, open, ...props }: Props) {
  return (
    <Details open={open} {...props}>
      <Summary>
        <Title>{title}</Title>
      </Summary>

      {children}
    </Details>
  );
}
