import { Outlet } from '@remix-run/react';

export function loader() {
  throw new Response(null, { status: 404 });
}

export default function Index() {
  return <Outlet />;
}
