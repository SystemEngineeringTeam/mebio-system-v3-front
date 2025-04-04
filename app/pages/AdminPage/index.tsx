"use client";

import QRReader from "@/components/QRReader";
import { Button } from "@/components/ui/button";
import { Form } from "@remix-run/react";
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

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    void (async () => {
      e.preventDefault();
      await fetch(`http://172.16.11.93:3000/qr/${memberId}`);
    })();
  }, [memberId]);

  return (
    <div className="flex flex-col items-center gap-5 h-full" data-scrollable="false">
      <div className="p-20">
        <QRReader onScan={handleScan} />
      </div>

      <Form method="post" action="." className="flex flex-col items-center gap-5" onSubmit={handleSubmit}>
        <Button type="submit" disabled={memberId === ""}>承認</Button>
        <p>{memberId}</p>
        <input type="hidden" name="memberId" value={memberId} />

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
