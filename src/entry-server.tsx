import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { AppShell } from './App';

export interface RenderResult {
  /** Rendered markup for #root */
  html: string;
  /** Serialised <head> tags collected from react-helmet-async */
  head: string;
  /** Attributes for <html>, e.g. lang="en" */
  htmlAttrs: string;
}

/**
 * Render one route to static HTML for the prerender step.
 *
 * Uses renderToPipeableStream rather than renderToString because every route
 * is behind React.lazy — renderToString would emit the Suspense fallback (the
 * loading spinner) and, critically, none of the per-page <PageSEO> tags. The
 * onAllReady callback waits for every lazy boundary to resolve first.
 */
export function render(url: string): Promise<RenderResult> {
  return new Promise((resolve, reject) => {
    // HelmetProvider populates `helmet` on this object during render.
    const helmetContext: { helmet?: HelmetServerState } = {};
    const errors: unknown[] = [];
    let body = '';

    const sink = new Writable({
      write(chunk, _encoding, callback) {
        body += chunk.toString();
        callback();
      },
    });

    sink.on('finish', () => {
      const { helmet } = helmetContext;
      const head = [helmet?.title, helmet?.meta, helmet?.link, helmet?.script]
        .filter(Boolean)
        .map((tag) => tag!.toString())
        .filter(Boolean)
        .join('\n    ');

      resolve({
        html: body,
        head,
        htmlAttrs: helmet?.htmlAttributes?.toString() ?? '',
      });
    });

    const timeout = setTimeout(() => {
      abort();
      reject(new Error(`Prerender timed out after 20s: ${url}`));
    }, 20_000);

    const { pipe, abort } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AppShell />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          clearTimeout(timeout);
          pipe(sink);
        },
        // Recoverable errors still let the render finish; surface them so a
        // silently-degraded page doesn't get published looking fine.
        onError(error) {
          errors.push(error);
        },
        onShellError(error) {
          clearTimeout(timeout);
          reject(error);
        },
      }
    );
  });
}
