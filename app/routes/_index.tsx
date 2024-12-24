import type { MetaFunction } from '@remix-run/cloudflare';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import { useCallback, useState } from 'react';
import { styled } from 'restyle';

export const meta: MetaFunction = () => [
  { title: 'New Remix App' },
  { name: 'description', content: 'Welcome to Remix!' },
];

const Center = styled('div', {
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'height': '100vh',
  'fontSize': '2rem',

  '> div': {
    textAlign: 'center',
  },
});

export default function Index() {
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <Center>
      <div>
        <h1>Hello, Remix!</h1>
        <Button onClick={() => { toggleDialog(); }}>Click me!!</Button>
        <Dialog onOpenChange={setOpen} open={open} />
      </div>
    </Center>
  );
}
