/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/_document.tsx
import * as React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '@/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="de">
        <Head>
          {(this.props as any).emotionStyleTags}
          <meta name="theme-color" content="#0b6bcb" />
          {/* Optionales Favicon (kann entfernt werden, wenn kein Logo gewünscht ist) */}
          <link
            rel="icon"
            href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect rx='12' width='64' height='64' fill='%230b6bcb'/%3E%3Cpath d='M20 18h16l8 8v20a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z' fill='%23fff'/%3E%3C/svg%3E"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp:
        (App: any) =>
        (props) =>
          <App emotionCache={cache} {...props} />,
    });

  const initialProps: any = await Document.getInitialProps(ctx);
  const emotionChunks = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionChunks.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return { ...initialProps, emotionStyleTags };
};
