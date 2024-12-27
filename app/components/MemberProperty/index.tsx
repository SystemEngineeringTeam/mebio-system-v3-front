import { Input, Select, Text } from '@/components/basic';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { styled } from 'restyle';

interface StringProperty {
  type: 'text';
  value: string | undefined;
}

interface NumberProperty {
  type: 'number';
  value: number | undefined;
}

interface DateProperty {
  type: 'date';
  value: Date | undefined;
  format?: string;
}

interface IconProperty {
  type: 'icon';
  value: string | undefined;
}

interface SelectProperty {
  type: 'select';
  value: string | undefined;
  options: ReadonlyArray<{ key: string; name: string }>;
}

export type Property = StringProperty | NumberProperty | DateProperty | IconProperty | SelectProperty;

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

type Props = {
  editable?: boolean;
  disabled?: boolean;
  property: string;
  onChange?: (value: string) => void;
} & Property;

export default function MemberProperty({ editable = true, disabled = false, property, value, onChange, ...rest }: Props) {
  const valueString = useMemo(() => {
    if (rest.type === 'date') {
      return dayjs(value).format(editable ? 'YYYY-MM-DD' : rest.format ?? 'YYYY年M月D日');
    } else if (rest.type === 'select') {
      return rest.options.find((option) => option.key === value)?.name ?? '';
    }

    return value?.toString() ?? '';
  }, [editable, rest, value]);

  const showValueString = !editable;
  const showInput = editable && rest.type !== 'select';
  const showSelect = editable && rest.type === 'select';
  const showIcon = rest.type === 'icon';

  const inputHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  }, [onChange]);

  const selectHandle = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) onChange(e.target.value);
  }, [onChange]);

  return (
    <SubGrid>
      <Text align="center" bold size="lg">{property}</Text>

      <ValueBox>
        {showValueString && <Text height="32.5px" nowrap overflow="scroll" size="lg">{valueString}</Text>}
        {showInput && <Input disabled={disabled} onChange={inputHandle} type={rest.type} value={valueString} />}
        {showSelect && <Select disabled={disabled} onChange={selectHandle} options={rest.options} value={valueString} />}
        {showIcon && <IconImage alt="icon" src={valueString} />}
      </ValueBox>
    </SubGrid>
  );
}
