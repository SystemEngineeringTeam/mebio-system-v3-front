import { css, styled } from 'restyle';

const TextBase = styled('p', {});

interface Props extends React.ComponentProps<typeof TextBase> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bold?: boolean;
}

export default function Text({ children, size = 'md', bold = false, ...props }: Props) {
  const [className, Styles] = css({
    fontSize: `var(--fontsize-${size})`,
    fontWeight: bold ? 'bold' : 'normal',
  });

  return (
    <>
      <Styles />
      <TextBase className={className} {...props}>
        {children}
      </TextBase>
    </>
  );
}
