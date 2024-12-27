import { css, styled } from 'restyle';

const ButtonBase = styled('button', {
  padding: '10px 12px',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
});

interface Props extends React.ComponentProps<typeof ButtonBase> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  outline?: boolean;
}

export default function Button({ children, size = 'md', outline = false, ...props }: Props) {
  const [className, Styles] = css({
    fontSize: `var(--fontsize-${size})`,
    color: outline ? 'var(--primary-color)' : 'var(--on-primary-color)',
    backgroundColor: outline ? 'var(--on-primary-color)' : 'var(--primary-color)',
    outline: outline ? '1px solid var(--primary-color)' : 'none',
  });

  return (
    <>
      <Styles />
      <ButtonBase className={className} {...props}>
        {children}
      </ButtonBase>
    </>
  );
}
