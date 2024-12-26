import { styled } from 'restyle';

interface Props {
  value: string;
  options: ReadonlyArray<{ key: string; name: string }>;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const SelectBase = styled('select', {
  padding: '5px',
  fontSize: 'var(--fontsize-md)',
});

export default function Select({ value, options, disabled = false, onChange }: Props) {
  return (
    <SelectBase disabled={disabled} onChange={(e) => onChange?.(e)} value={value}>
      {options.map((option) => (
        <option key={option.key} value={option.name}>{option.name}</option>
      ))}
    </SelectBase>
  );
}
