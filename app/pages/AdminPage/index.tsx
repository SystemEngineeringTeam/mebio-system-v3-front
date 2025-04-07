"use client";

import QRReader from "@/components/QRReader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Link } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

interface Props {
  message: string | undefined;
}

export default function AdminPage({ message }: Props) {
  const [memberId, setMemberId] = useState<string>("");

  const handleScan = useCallback((data: string) => {
    const memberIdRes = z.string().uuid().safeParse(data);
    if (!memberIdRes.success) return;

    setMemberId(memberIdRes.data);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const memberIdRes = z.string().uuid().safeParse(value);
    if (!memberIdRes.success) return;

    setMemberId(memberIdRes.data);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 h-full" data-scrollable="false">
      <div className="p-20">
        <QRReader onScan={handleScan} />
      </div>

      <Form method="post" action="." className="flex flex-col items-center gap-5">
        <Button type="submit" disabled={memberId === ""}>承認</Button>
        <Input type="text" name="memberId" value={memberId} onChange={handleChange} />

        <Message message={message} key={`${message}:${memberId}`} />
      </Form>
    </div>
  );
}

function Message({ message: _message }: Props) {
  const [message, setMessage] = useState<string | undefined>(_message);

  useEffect(() => {
    setInterval(() => {
      setMessage(undefined);
    }, 3000);
  }, [_message]);

  return <p>{message}</p>;
}
