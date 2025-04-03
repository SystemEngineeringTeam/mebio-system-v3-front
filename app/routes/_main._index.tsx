import MemberListPage from '@/pages/MemberListPage';
import { typedjson } from 'remix-typedjson';

export function meta() {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
}

export async function loader() {
  return typedjson({});
}

export default function Index() {
  return <MemberListPage />;
};
