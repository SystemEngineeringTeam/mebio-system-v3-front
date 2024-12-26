import { Input, Select, Text } from '@/components/basic';
import { useCallback, useState } from 'react';
import { styled } from 'restyle';

interface StringProperty {
  type: 'text';
  value: string;
}

interface NumberProperty {
  type: 'number';
  value: number;
}

interface DateProperty {
  type: 'date';
  value: Date;
}

interface IconProperty {
  type: 'icon';
  value: string;
}

interface SelectProperty {
  type: 'select';
  value: string;
  options: ReadonlyArray<{ key: string; name: string }>;
}

type Props = {
  editable?: boolean;
  disabled?: boolean;
  property: string;
  onChange?: (value: string) => void;
} & (StringProperty | NumberProperty | DateProperty | IconProperty | SelectProperty);

const SubGrid = styled('div', {
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
});

const ValueBox = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const IconImage = styled('img', {
  width: '100px',
  height: '100px',
});

export default function MemberProperty({ editable = true, disabled = false, property, value, onChange, ...rest }: Props) {
  const [v, setV] = useState<typeof value>(value);

  const showValueString = !(editable || (!editable && rest.type === 'icon'));
  const showInput = editable && rest.type !== 'select';
  const showSelect = editable && rest.type === 'select';
  const showIcon = rest.type === 'icon';

  const inputHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setV(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  }, [onChange]);

  const selectHandle = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setV(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  }, [onChange]);

  return (
    <SubGrid>
      <Text align="center" bold size="lg">{property}</Text>

      <ValueBox>
        {showValueString && <Text size="lg">{value.toString()}</Text>}
        {showInput && <Input disabled={disabled} onChange={inputHandle} value={v.toString()} />}
        {showSelect && <Select disabled={disabled} onChange={selectHandle} options={rest.options} value={v.toString()} />}
        {showIcon && <IconImage alt="icon" src={v.toString()} />}
      </ValueBox>
    </SubGrid>
  );
}
