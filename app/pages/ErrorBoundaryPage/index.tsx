import { isRouteErrorResponse, Link } from '@remix-run/react';
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
          <Link to="/">ホームへ</Link>
        </ErrorPageBase>
      );
    }
    else if (error.status === 500) {
      return (
        <ErrorPageBase message="サーバーでエラーが発生しました．しばらくしてから再度お試しください" title="500 Internal Server Error">
          <Link to="/">ホームへ</Link>
        </ErrorPageBase>
      );
    }
    else {
      return (
        <ErrorPageBase message="エラーが発生しました．" title={`${error.status} ${error.statusText}`}>
          <Link to="/">ホームへ</Link>
        </ErrorPageBase>
      );
    }
  }

  else if (error instanceof Error) {
    return (
      <div>
        <ErrorPageBase message="エラーが発生しました．" title="システムエラー">
          <Link to="/">ホームへ</Link>
          <pre>{error.stack}</pre>
        </ErrorPageBase>
      </div>
    );
  }

  return (
    <ErrorPageBase message="不明なエラーが発生しました．" title="不明なエラー">
      <Link to="/">ホームへ</Link>
    </ErrorPageBase>
  );
}
