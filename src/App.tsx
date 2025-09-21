// src/App.tsx
import * as React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
  Theme,
  Container,
  Stack,
  Button,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Sidebar, NavKey } from './components/Sidebar';
import { getTheme } from './theme';

const DRAWER_WIDTH = 260;

export default function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [current, setCurrent] = React.useState<NavKey>('home');

  const handleToggleTheme = () => setMode(m => (m === 'light' ? 'dark' : 'light'));
  const handleOpenMobile = () => setMobileOpen(true);
  const handleCloseMobile = () => setMobileOpen(false);

  const pageTitleMap: Record<NavKey, string> = {
    home: 'Übersicht',
    documents: 'Dokumente',
    archiv: 'Archiv',
    settings: 'Einstellungen',
    user: 'Benutzerprofil',
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          ...(isDesktop && { width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px` }),
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton aria-label="Menü öffnen" onClick={handleOpenMobile} edge="start" sx={{ mr: 1 }}>
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
            DMS – {pageTitleMap[current]}
          </Typography>
          <IconButton aria-label="Theme umschalten" onClick={handleToggleTheme}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        width={DRAWER_WIDTH}
        open={mobileOpen}
        onClose={handleCloseMobile}
        current={current}
        onNavigate={setCurrent}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          pt: { xs: 9, sm: 10 }, // Platz für AppBar
          ...(isDesktop && { ml: `${DRAWER_WIDTH}px` }),
          minHeight: '100dvh',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          {/* Demo-Inhalte pro Bereich */}
          {current === 'home' && <HomePage />}
          {current === 'documents' && <DocumentsPage />}
          {current === 'archiv' && <ArchivPage />}
          {current === 'settings' && <SettingsPage />}
          {current === 'user' && <UserPage />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

function HomePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Willkommen im DMS</Typography>
      <Typography variant="body1">
        Nutzen Sie die Sidebar, um zwischen „Documents“, „Archiv“, „Settings“ und „User“ zu wechseln.
      </Typography>
    </Stack>
  );
}

function DocumentsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Dokumente</Typography>
      <Typography variant="body2">
        Hier würden Listen, Filter, Uploads und Metadaten erscheinen.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained">Neues Dokument</Button>
        <Button variant="outlined">Import</Button>
      </Stack>
    </Stack>
  );
}

function ArchivPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Archiv</Typography>
      <Typography variant="body2">
        Historisierte/abgelegte Dokumente mit Such- und Wiederherstellungsfunktionen.
      </Typography>
    </Stack>
  );
}

function SettingsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Einstellungen</Typography>
      <Typography variant="body2">Globale DMS-Konfiguration, Rollen, Policies.</Typography>
    </Stack>
  );
}

function UserPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Benutzerprofil</Typography>
      <Typography variant="body2">Profil, Sicherheit, Benachrichtigungen.</Typography>
    </Stack>
  );
}
