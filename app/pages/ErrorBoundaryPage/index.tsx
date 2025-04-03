import { Button } from '@/components/ui/button';
import { Form, isRouteErrorResponse, Link } from '@remix-run/react';
import ErrorPageBase from './ErrorPageBase';

interface Props {
  error: unknown;
  notFoundItem: string;
}

export default function ErrorBoundaryPage({ error, notFoundItem }: Props) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorPageBase message={`${notFoundItem}が見つかりませんでした.`} title="404 Not Found">
          <Button asChild className="mt-5">
            <Link to="/">ホームへ</Link>
          </Button>
        </ErrorPageBase>
      );
    } else if (error.status === 403) {
      return (
        <ErrorPageBase message="アクセスできません．" title="403 Forbidden">
          <Button asChild className="mt-5">
            <Link to="/">ホームへ</Link>
          </Button>
        </ErrorPageBase>
      );
    } else if (error.status === 401) {
      return (
        <ErrorPageBase message="認証に失敗しました．" title="401 Unauthorized">
          <Form action="/auth/login" method="post" className='flex flex-col'>
            <Button type="submit">ログイン</Button>
          </Form>
        </ErrorPageBase>
      );
    } else if (error.status === 500) {
      return (
        <ErrorPageBase message="サーバーでエラーが発生しました．しばらくしてから再度お試しください" title="500 Internal Server Error">
          <Button asChild className="mt-5">
            <Link to="/">ホームへ</Link>
          </Button>
        </ErrorPageBase>
      );
    } else {
      return (
        <ErrorPageBase message="エラーが発生しました．" title={`${error.status} ${error.statusText}`}>
          <Button asChild className="mt-5">
            <Link to="/">ホームへ</Link>
          </Button>
        </ErrorPageBase>
      );
    }
  } else if (error instanceof Error) {
    return (
      <div>
        <ErrorPageBase message="エラーが発生しました．" title="システムエラー">
          <Button asChild className="mt-5">
            <Link to="/">ホームへ</Link>
          </Button>
          <pre className='w-full overflow-scroll'>{error.stack}</pre>
        </ErrorPageBase>
      </div>
    );
  }

  return (
    <ErrorPageBase message="不明なエラーが発生しました．" title="不明なエラー">
      <Button asChild className="mt-5">
        <Link to="/">ホームへ</Link>
      </Button>
    </ErrorPageBase>
  );
}
