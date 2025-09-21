// src/components/Sidebar.tsx
import * as React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Theme,
  Tooltip,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

export type NavKey = 'home' | 'documents' | 'archiv' | 'settings' | 'user';

export interface SidebarProps {
  width?: number;
  open: boolean;                   // für Mobile: gesteuert durch Burger-Button
  onClose: () => void;             // für Mobile: Drawer schließen
  current: NavKey;                 // aktiver Menüpunkt
  onNavigate: (key: NavKey) => void;
}

const TOP_ITEMS: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'Home', icon: <HomeRoundedIcon /> },
  { key: 'documents', label: 'Documents', icon: <DescriptionRoundedIcon /> },
  { key: 'archiv', label: 'Archiv', icon: <ArchiveRoundedIcon /> },
];

const BOTTOM_ITEMS: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'settings', label: 'Settings', icon: <SettingsRoundedIcon /> },
  { key: 'user', label: 'User', icon: <AccountCircleRoundedIcon /> },
];

export function Sidebar(props: SidebarProps) {
  const { width = 260, open, onClose, current, onNavigate } = props;
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up('md'));

  const content = (
    <Box
      role="navigation"
      aria-label="Dokumenten-Management Navigation"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Platz für AppBar-Offset */}
      <Toolbar />
      {/* Top-Bereich */}
      <List sx={{ px: 0.5 }}>
        {TOP_ITEMS.map(item => (
          <Tooltip key={item.key} title={item.label} placement="right" disableInteractive>
            <ListItemButton
              selected={current === item.key}
              aria-current={current === item.key ? 'page' : undefined}
              onClick={() => {
                onNavigate(item.key);
                if (!isDesktop) onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Bottom-Bereich */}
      <List sx={{ px: 0.5, pb: 1 }}>
        {BOTTOM_ITEMS.map(item => (
          <Tooltip key={item.key} title={item.label} placement="right" disableInteractive>
            <ListItemButton
              selected={current === item.key}
              aria-current={current === item.key ? 'page' : undefined}
              onClick={() => {
                onNavigate(item.key);
                if (!isDesktop) onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        open
        PaperProps={{ sx: { width, borderRight: 0 } }}
      >
        {content}
      </Drawer>
    );
  }

  // Mobile
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width } }}
    >
      {content}
    </Drawer>
  );
}
