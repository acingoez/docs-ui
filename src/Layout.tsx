// src/Layout.tsx
import * as React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  Theme,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 272;

export default function Layout({
  children,
  mode,
  onToggleMode,
}: React.PropsWithChildren<{ mode: 'light' | 'dark'; onToggleMode: () => void }>) {
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
          ...(isDesktop && { width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px` }),
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {!isDesktop && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              edge="start"
              sx={{ mr: 0.5 }}
              aria-label="Menü öffnen"
            >
              <MenuRoundedIcon />
            </IconButton>
          )}

          {/* Brand – ausschließlich im Header */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              letterSpacing: 0.3,
              mr: 'auto',
            }}
          >
            <Box component="span" sx={{ color: 'primary.main' }}>docu</Box>
            <Box component="span" sx={{ color: 'text.primary' }}>Me</Box>
          </Typography>

          <IconButton onClick={onToggleMode} aria-label="Theme umschalten">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar width={DRAWER_WIDTH} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          minHeight: '100dvh',
          bgcolor: 'background.default',
          pt: { xs: 9, sm: 10 },
          ...(isDesktop && { ml: `${DRAWER_WIDTH}px` }),
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </>
  );
}
