// pages/_app.tsx
import * as React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { CacheProvider, EmotionCache } from '@emotion/react';
import '../styles/global.css';
import createEmotionCache from '@/createEmotionCache';
import { getTheme } from '@/theme';
import Layout from '@/Layout';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>docuMe – DMS</title>
        </Head>
        <CssBaseline />
        <Layout mode={mode} onToggleMode={() => setMode(m => (m === 'light' ? 'dark' : 'light'))}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}
