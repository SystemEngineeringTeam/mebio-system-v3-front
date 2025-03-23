import AdminPage from '@/pages/AdminPage';

interface LoaderData {}

export function loader(): LoaderData {
  return { };
}

export default function Index() {
  return <AdminPage />;
};
