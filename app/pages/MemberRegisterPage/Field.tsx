import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldMetadata } from "@conform-to/react";

interface FieldTextProps {
  name: string;
  p: FieldMetadata<string, {}, string[]>;
}

export function FieldText({ name, p }: FieldTextProps) {
  return (
    <>
      <div className="grid grid-cols-subgrid col-span-2">
        <Label htmlFor={p.id}>{name}</Label>
        <Input type="text" name={p.name} defaultValue={p.value} />
      </div>

      <div className="grid grid-cols-subgrid col-span-2">
        <p className="text-destructive col-[-1]">{p.errors}</p>
      </div>
    </>
  );
}

interface FieldDateProps {
  name: string;
  p: FieldMetadata<Date, {}, string[]>;
}

export function FieldDate({ name, p }: FieldDateProps) {
  return (
    <>
      <div className="grid grid-cols-subgrid col-span-2">
        <Label htmlFor={p.id}>{name}</Label>
        <Input type="date" name={p.name} defaultValue={p.value} />
      </div>

      <div className="grid grid-cols-subgrid col-span-2">
        <p className="text-destructive col-[-1]">{p.errors}</p>
      </div>
    </>
  );
}
