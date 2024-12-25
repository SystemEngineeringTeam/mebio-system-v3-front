import { css, styled } from 'restyle';

const TextBase = styled('p', {});

interface Props extends React.ComponentProps<typeof TextBase> {
  color?: 'primary' | 'on-primary' | 'text' | 'background' | 'background-dark' | 'on-background';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bold?: boolean;
}

export default function Text({ children, color, size = 'md', bold = false, ...props }: Props) {
  const [className, Styles] = css({
    color: color ? `var(--${color}-color)` : 'var(--text-color)',
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
