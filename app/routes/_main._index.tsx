import MemberListPage from '@/pages/MemberListPage';

export function meta() {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
}

interface LoaderData {}

export function loader(): LoaderData {
  return { };
}

export default function Index() {
  return <MemberListPage />;
};
