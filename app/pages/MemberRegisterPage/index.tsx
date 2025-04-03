"use client";

import { Button } from "@/components/ui/button";
import { FieldDate, FieldText } from "@/pages/MemberRegisterPage/Field";
import { zMemberCreate } from "@/schemas/member";
import { getInputProps, SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from '@conform-to/zod';
import { Form } from "@remix-run/react";

interface Props {
  lastResult: SubmissionResult<string[]> | null;
}

export default function MemberRegisterPage<T>({ lastResult }: Props) {
  const [form, p] = useForm({
    shouldValidate: "onBlur",
    lastResult: lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: zMemberCreate });
    },
  });

  return (
    <div>
      <Form action="." method="post" onSubmit={form.onSubmit} id={form.id}>
        <div className="grid grid-cols-[200px_1fr] gap-2 max-w-[600px] mx-auto py-20 items-center">
          <div className="grid col-span-2 text-center py-5">
            <h2 className="text-xl font-bold">公開情報</h2>
            <p>この情報は全ての部員が閲覧可能です</p>
          </div>
          <input {...getInputProps(p.email, { type: "text" })} />

          <FieldText name="名前(姓)" p={p.firstName} />
          <FieldText name="名前(名)" p={p.lastName} />
          <FieldText name="フリガナ(姓)" p={p.lastNameKana} />
          <FieldText name="フリガナ(名)" p={p.lastNameKana} />
          <FieldText name="フリガナ(名)" p={p.lastNameKana} />
          <FieldText name="学年" p={p.grade} />
          <FieldText name="学籍番号" p={p.studentId} />
          <FieldText name="役職" p={p.role} />

          <div className="grid col-span-2 text-center py-5">
            <h2 className="text-xl font-bold">非公開情報</h2>
            <p>この情報は役員のみが閲覧可能です</p>
          </div>
          <input {...getInputProps(p.email, { type: "text" })} />

          <FieldDate name="誕生日" p={p.birthday} />
          <FieldText name="名前(名)" p={p.gender} />
          <FieldText name="電話番号" p={p.phoneNumber} />
          <FieldText name="現在の郵便番号" p={p.currentZipCode} />
          <FieldText name="現在の住所" p={p.currentAddress} />
          <FieldText name="実家の郵便番号" p={p.parentsZipCode} />
          <FieldText name="実家の住所" p={p.parentsAddress} />

          <div className="col-span-2 flex justify-center py-10">
            <Button type="submit">送信</Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
