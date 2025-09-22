// src/Layout.tsx
import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  useMediaQuery,
  Theme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Sidebar from './Sidebar';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

// Gleiche Breite wie im Drawer (Sidebar)
const DRAWER_WIDTH = 260;

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function Layout({ title = 'docuMe', children }: LayoutProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* WICHTIG: Auf Desktop den Content links um Drawer-Breite einrücken */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: { lg: `${DRAWER_WIDTH}px` },
        }}
      >
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            mt: 1.5,
            backgroundImage: 'none',
          }}
        >
          <Toolbar
            sx={{
              gap: 1,
              bgcolor: 'background.paper',
              borderRadius: 3,
              px: 2,
              boxShadow: (t) =>
                t.palette.mode === 'light'
                  ? '0 1px 2px rgba(0,0,0,0.06)'
                  : '0 1px 2px rgba(0,0,0,0.4)',
              backdropFilter: 'saturate(120%) blur(6px)',
            }}
          >
            {!isDesktop && (
              <IconButton onClick={() => setOpen(true)} edge="start" aria-label="Menü">
                <MenuIcon />
              </IconButton>
            )}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.4 }}>
                docuMe
              </Typography>
            </Link>
            <Box sx={{ flex: 1 }} />
            <ColorModeContext.Consumer>
              {({ toggleColorMode }) => (
                <Tooltip title="Theme umschalten">
                  <IconButton onClick={toggleColorMode} aria-label="Theme umschalten">
                    <DarkModeIcon />
                    {/* Alternativ dynamisch je nach Mode; hier neutral gehalten */}
                    <LightModeIcon sx={{ display: 'none' }} />
                  </IconButton>
                </Tooltip>
              )}
            </ColorModeContext.Consumer>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3, width: '100%' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
