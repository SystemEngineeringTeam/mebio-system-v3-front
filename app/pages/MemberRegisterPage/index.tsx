import { Label } from "@/components/ui/label";
import { zMemberCreate } from "@/schemas/member";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod } from '@conform-to/zod';
import { Form } from "@remix-run/react";

export default function MemberRegisterPage() {
  const [form, { firstName }] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: zMemberCreate });
    },
  });

  return (
    <div>
      <Form method="post" {...getFormProps(form)}>
        <div className="grid grid-cols-[200px_1fr] gap-2">
          <div key={firstName.id} className="grid grid-cols-subgrid">
            <Label htmlFor={firstName.id}>{firstName.name}</Label>
            <input {...getInputProps(firstName, { type: "text" })} />
          </div>
        </div>
      </Form>
    </div>
  )
}
