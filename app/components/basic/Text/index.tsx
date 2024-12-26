import { css, styled } from 'restyle';

const TextBase = styled('p', {});

interface Props extends React.ComponentProps<typeof TextBase> {
  color?: 'primary' | 'on-primary' | 'text' | 'background' | 'background-dark' | 'on-background';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  height?: string;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
  nowrap?: boolean;
  overflow?: 'hidden' | 'visible' | 'scroll' | 'auto';
}

export default function Text({ children, color, size = 'md', height, bold = false, align, nowrap = false, overflow, ...props }: Props) {
  const [className, Styles] = css({
    color: color ? `var(--${color}-color)` : 'var(--text-color)',
    fontSize: `var(--fontsize-${size})`,
    fontWeight: bold ? 'bold' : 'normal',
    textAlign: align,
    whiteSpace: nowrap ? 'nowrap' : 'normal',
    lineHeight: height,
    height,
    overflow,
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
