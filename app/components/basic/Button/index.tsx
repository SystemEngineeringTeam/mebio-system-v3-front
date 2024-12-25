import { css, styled } from 'restyle';

const ButtonBase = styled('button', {
  padding: '10px 12px',
  color: 'var(--on-primary-color)',
  backgroundColor: 'var(--primary-color)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
});

interface Props extends React.ComponentProps<typeof ButtonBase> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Button({ children, size = 'md', ...props }: Props) {
  const [className, Styles] = css({
    fontSize: `var(--fontsize-${size})`,
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
