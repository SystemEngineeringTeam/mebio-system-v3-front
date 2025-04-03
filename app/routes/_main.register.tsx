import MemberRegisterPage from "@/pages/MemberRegisterPage";
import { MemberRepository } from "@/repository/member.repository";
import { zMemberCreate } from "@/schemas/member";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect, useTypedActionData } from "remix-typedjson";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: zMemberCreate });

  // Send the submission back to the client if the status is not successful
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const member = MemberRepository.create(context.__prisma, submission.value);

  throw redirect('/member');
}

export default function Index() {
  const lastResult = useTypedActionData<typeof action>();
  return <MemberRegisterPage lastResult={lastResult} />;
}
