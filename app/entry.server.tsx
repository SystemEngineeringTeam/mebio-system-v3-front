import type { EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { renderToReadableStream } from 'react-dom/server';

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ABORT_DELAY);

  const body = await renderToReadableStream(
    <RemixServer
      abortDelay={ABORT_DELAY}
      context={remixContext}
      url={request.url}
    />,
    {
      signal: controller.signal,
      onError(error: unknown) {
        if (!controller.signal.aborted) {
          console.error(error);
        }
        responseStatusCode = 500;
      },
    },
  );

  void body.allReady.then(() => {
    clearTimeout(timeoutId);
  });

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
